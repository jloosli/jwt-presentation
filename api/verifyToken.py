#!/usr/bin/env python
import jose.jwt
import json
import os
import http.server
import socketserver
import logging
import cgi

PORT = 9000

__location__ = os.path.realpath(
        os.path.join(os.getcwd(), os.path.dirname(__file__)))

with open(os.path.join(__location__, '..', 'config.json')) as f:
    config = json.load(f)

print(config)


class ServerHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        logging.warning("======= GET STARTED =======")
        logging.warning(self.headers)
        http.server.SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):
        success = True
        logging.warning("======= POST STARTED =======")
        logging.warning(self.headers)
        form = cgi.FieldStorage(fp=self.rfile,
                                headers=self.headers,
                                environ={'REQUEST_METHOD': 'POST',
                                         'CONTENT_TYPE': self.headers['Content-Type'],
                                         })
        token = str(form.getvalue('token', None))
        if token:
            logging.warning("Token received: {}\n".format(token))
            try:
                payload = jose.jwt.decode(token, config['secret'], algorithms=config['algorithm'], options={},
                                          audience=config['audience'], issuer=config['issuer'])
                logging.warning(payload)
            except jose.JWTError as e:
                success = False
                logging.warning('Invalid Token')
                print(e)
        else:
            logging.warning('No Token')
            success = False

        code = 200 if success else 400
        response = {
            'meta': {
                'success': success,
                'message': 'Token is {}'.format('good' if success else 'invalid'),
                'code': code
            }
        }
        r = json.dumps(response)
        logging.warning(r)
        self.send_response(code)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header('Content-type', 'application/json;charset=utf-8')
        self.send_header('Content-length', len(r))
        self.end_headers()
        self.wfile.write(r.encode('utf-8'))
        self.wfile.flush()


Handler = ServerHandler

httpd = socketserver.TCPServer(("", PORT), Handler)
try:
    print("serving at port", PORT)
    httpd.serve_forever()
except:
    print('Shutting down server')
    httpd.socket.close()

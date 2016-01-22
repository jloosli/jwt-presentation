var box = document.getElementById('results-box');
function getToken() {
    var username = document.getElementById('username'),
        password = document.getElementById('password'),
        remember = document.getElementById('remember-me');
    clearToken();
    if (window.fetch) {
        fetch('/api/getToken.php', {
            method: 'post',
            body:   new FormData(document.getElementById('login-form'))
        }).then(function (response) {
            console.log(response);
            return response.json();
        }).then(function (data) {
            if (data.meta.success) {
                if (remember.checked) {
                    localStorage.setItem('token', data.token);
                } else {
                    sessionStorage.setItem('token', data.token);
                }
            }
            console.log(data);
            toggleAccess();
        }).catch(function (err) {
            console.log(err);
            toggleAccess();
        });
    } else {
        alert('Ooops. This won\'t work on this browser.');
    }
}

function validateToken(endpoint) {
    var endpointURL;
    switch (endpoint) {
        case 'python':
            endpointURL = 'http://localhost:9000/api/verifyToken.py';
            break;
        case 'php':
        default:
            endpointURL = '/api/verifyToken.php';
    }
    var token = localStorage.getItem('token') || sessionStorage.getItem('token');
    data = new FormData();
    data.append('token', token);
    fetch(endpointURL, {
        method: 'post',
        body:   data
    }).then(function (response) {
        return response.json();
    }).then(function (response) {
        console.log(response);
        if (response.meta.success) {
            box.innerHTML += ' VALID!';
        } else {
            box.innerHTML += ' INVALID!';
        }
    }).catch(function (err) {
        console.log(err);
    })
}

function getPayload() {
    var token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
        return false;
    }
    var parts = token.split('.'),
        payload_encoded = parts[1],
        payload = JSON.parse(atob(payload_encoded));
    return payload;

}

function toggleAccess() {
    var payload = getPayload();
    var body = document.getElementsByTagName('body')[0];

    body.classList.remove('admin');
    body.classList.remove('user');
    if (payload) {
        if (payload.access == 'admin') {
            body.classList.add('admin');
            box.innerHTML = 'You are an admin.';
        }
        if (payload.access == 'user') {
            body.classList.add('user');
            box.innerHTML = 'You are a user.';
        }
        box.innerHTML += '<div class="payload">Payload:<br><pre>' + JSON.stringify(payload, null, 2) + '</pre></div>';
        box.innerHTML += '<button onclick="validateToken(\'php\')">Validate (PHP)</button>';
        box.innerHTML += '<button onclick="validateToken(\'python\')">Validate (Python)</button>';
    } else {
        box.innerHTML = 'You are not logged in';
    }
    // update results box

}

function clearToken() {
    localStorage.clear();
    sessionStorage.clear();
    toggleAccess();
}

window.addEventListener('storage', function (e) {
    if (e.key === 'token') {
        toggleAccess();
    }
});

toggleAccess();
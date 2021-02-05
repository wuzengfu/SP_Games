/*
  Name: Wu Zengfu
  Admission Number: 2033457
  Class: DIT/04
*/

/* Handle the visibility of login button , logout menu, Edit button based on usertype */
$(document).ready(function () {
    let value = window.localStorage.getItem('token');
    $('#loginFailed').hide();

    axios.get(`${baseUrl}/user/type`, {
        headers:
        {
            authorization: "Bearer " + value
        }
    }).then(res => {
        if (res.data !== "Admin") {
            $('#editGames').hide();
        }
    }).catch(err => {
        $('#editGames').hide();
    })

    if (value != null || value != undefined) {
        $('#loginDropdown').hide();
        $('#loginBar').hide();
        $('#logoutDropdown').show();
        $('#loginName').text(window.localStorage.getItem('username'));
        $('#loginModal').modal('hide');
    } else {
        $('#logoutDropdown').hide();
    }
});

/* Verify Login */
$('#loginForm').submit((eve) => {
    eve.preventDefault();
    const requestBody = {
        email: $("#email").val(),
        password: $("#password").val()
    };
    axios.post(`${baseUrl}/login/`, requestBody).
        then((res) => {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('username', res.data.user_name);
            $('#loginName').text(res.data.user_name);
            alert('Hello! ' + res.data.user_name);
            $('#loginModal').modal('hide');
            window.location.reload();
        }).catch((err) => {
            $('#loginFailed').show();
            $('#email').addClass("border-danger")
            $('#password').addClass("border-danger")
            alert("Please enter the correct password or email!");
            console.log(err);
        });
});

/* Logout */
$("#logout").click(() => {
    $('#logoutModal').modal('show');
    $('body').css("padding-right", "0");
    $('#logoutHeader').text('Hi, ' + $('#loginName').text());
});

const logoutConfirm = function (source) {
    var redirectedLink = source == 'details' ? './details.html' : './index.html';
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('username');
    window.location.assign(redirectedLink);
    alert("You have logged out successfully!");
}

/* Show Login Modal when login is pressed */
$('#loginBar').click(() => {
    $('#loginModal').modal('show');
    $('body').css("padding-right", "0");
})
/* Handle the visibility of login button , logout menu, Edit button based on usertype */
$(document).ready(function () {
    let value = window.localStorage.getItem('userid');
    $('#loginFailed').hide();
    if (window.localStorage.getItem('userType') !== 'Admin') {
        $('#editGames').hide();
    }
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
            if (res != null) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('userid', res.data.user_id);
                localStorage.setItem('userType', res.data.user_type);
                localStorage.setItem('username', res.data.user_name);
                $('#loginName').text(res.data.user_name);
                alert('Hello! ' + res.data.user_name);
                $('#loginModal').modal('hide');
                window.location.reload();
            } else {
                alert("Please enter the correct password or email!");
                console.log("Error");
            }
        }).catch((err) => {
            $('#loginFailed').show();
            alert("Please enter the correct password or email!");
            console.log(err);
        });
});

/* Logout */
$("#logout").click(() => {
    $('#logoutModal').modal('show');
    $('#logoutHeader').text('Hi, ' + $('#loginName').text());
});
const logoutConfirm = function (source) {
    var redirectedLink = source == 'details' ? './details.html' : './index.html';
    window.localStorage.removeItem('userid');
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('userType');
    window.localStorage.removeItem('username');
    window.location.assign(redirectedLink);
    alert("You have logged out successfully!");
}

/* Show Login Modal when login is pressed */
$('#loginBar').click(() => {
    $('#loginModal').modal('show');
})
$(document).ready(function () {
    let value = window.localStorage.getItem('userid');
    if (window.localStorage.getItem('userType') !== 'Admin') {
        $('#editGames').hide();
    }
    $('#loginFailed').hide();
    if (value != null || value != undefined) {
        $('#loginDropdown').hide();
        $('#loginBar').hide();
        $('#logoutDropdown').show();
        $('#loginName').text(window.localStorage.getItem('username'));
        $('#loginModal').modal('hide');
    } else {
        $('#logoutDropdown').hide();
        //$('#loginModal').modal('show');
        //fromBuffer , mv , req.files
    }
});

/* Verify Login */
$('#loginForm').submit((eve) => {
    eve.preventDefault();
    var email = $('#email').val();
    var password = $('#password').val();
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
                // $('#logoutDropdown').show();
                // $('#loginDropdown').hide();
                // $('#loginBar').hide();
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
$('#logoutConfirm').click(() => {
    window.localStorage.removeItem('userid');
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('userType');
    window.localStorage.removeItem('username');
    window.location.reload();
    alert("You have logged out successfully!");
    // $('#logoutModal').modal('hide');
    // $('#logoutDropdown').hide();
    // $('#loginBar').show();
});

/* Show Login Modal when login is pressed */
$('#loginBar').click(() => {
    $('#loginModal').modal('show');
})
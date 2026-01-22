$(document).ready(function () {

    /* ===== Regex Patterns ===== */
    const namePattern = /^[A-Za-z]+$/; // Only letters, no spaces or special characters
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|in|edu|mil)$/;
    const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

    /* ===== Department Theme Change ===== */
    $("#department").change(function () {
        let dept = $(this).val();
        let labels = $(".form-label");
        let inputs = $(".form-input");

        // Remove old theme classes
        labels.removeClass("it-label hr-label intern-label");
        inputs.removeClass("it-input hr-input intern-input");

        // Apply new theme
        if (dept === "it") {
            labels.addClass("it-label");
            inputs.addClass("it-input");
        }
        else if (dept === "hr") {
            labels.addClass("hr-label");
            inputs.addClass("hr-input");
        }
        else if (dept === "intern") {
            labels.addClass("intern-label");
            inputs.addClass("intern-input");
        }

        // Clear all error messages when department changes
        $(".error-msg").text("");
    });


    /* ===== Show / Hide Password ===== */
    $("#togglePass").click(function () {
        let passField = $("#password");
        if (passField.attr("type") === "password") {
            passField.attr("type", "text");
            $(this).removeClass("fa-eye").addClass("fa-eye-slash");
        } else {
            passField.attr("type", "password");
            $(this).removeClass("fa-eye-slash").addClass("fa-eye");
        }
    });

    $("#toggleCPass").click(function () {
        let passField = $("#cpassword");
        if (passField.attr("type") === "password") {
            passField.attr("type", "text");
            $(this).removeClass("fa-eye").addClass("fa-eye-slash");
        } else {
            passField.attr("type", "password");
            $(this).removeClass("fa-eye-slash").addClass("fa-eye");
        }
    });


    /* ===== Live Password Rules Check ===== */
    $("#password").on("input", function () {
        let password = $(this).val();

        $("#rule-length").toggleClass("valid", password.length >= 8);
        $("#rule-upper").toggleClass("valid", /[A-Z]/.test(password));
        $("#rule-lower").toggleClass("valid", /[a-z]/.test(password));
        $("#rule-number").toggleClass("valid", /[0-9]/.test(password));
        $("#rule-special").toggleClass("valid", /[@$!%*?&]/.test(password));

        // Real-time password error checking
        validatePassword();
    });

    /* ===== Real-time Email Validation ===== */
    $("#email").on("blur", function () {
        validateEmail();
    });

    /* ===== Real-time Name Validation ===== */
    $("#fname").on("blur", function () {
        validateFirstName();
    });

    $("#mname").on("blur", function () {
        validateMiddleName();
    });

    $("#lname").on("blur", function () {
        validateLastName();
    });

    /* ===== Real-time Confirm Password Validation ===== */
    $("#cpassword").on("blur", function () {
        validateConfirmPassword();
    });

    /* ===== Real-time File Validation ===== */
    $("#profilePic").on("change", function () {
        validateProfilePic();
    });


    /* ===== Validation Functions ===== */

    function validateFirstName() {
        let fname = $("#fname").val().trim();
        let error = "";

        if (fname === "") {
            error = "First name is mandatory!";
        } else if (!namePattern.test(fname)) {
            error = "No spaces or special characters allowed!";
        }

        $("#fname-error").text(error);
        return error === "";
    }

    function validateMiddleName() {
        let mname = $("#mname").val().trim();
        let error = "";

        if (mname !== "" && !namePattern.test(mname)) {
            error = "No spaces or special characters allowed!";
        }

        $("#mname-error").text(error);
        return error === "";
    }

    function validateLastName() {
        let lname = $("#lname").val().trim();
        let error = "";

        if (lname === "") {
            error = "Last name is mandatory!";
        } else if (!namePattern.test(lname)) {
            error = "No spaces or special characters allowed!";
        }

        $("#lname-error").text(error);
        return error === "";
    }

    function validateEmail() {
        let email = $("#email").val().trim();
        let error = "";

        if (email === "") {
            error = "Email is mandatory!";
        } else if (!emailPattern.test(email)) {
            error = "Invalid email format! Use .com/.org/.in/.edu/.mil";
        }

        $("#email-error").text(error);
        return error === "";
    }

    function validatePassword() {
        let password = $("#password").val();
        let error = "";

        if (password === "") {
            error = "Password is mandatory!";
        } else if (password.length < 8) {
            error = "At least 8 characters required!";
        } else if (!/[A-Z]/.test(password)) {
            error = "Need one uppercase letter!";
        } else if (!/[a-z]/.test(password)) {
            error = "Need one lowercase letter!";
        } else if (!/[0-9]/.test(password)) {
            error = "Need one number!";
        } else if (!/[@$!%*?&]/.test(password)) {
            error = "Need one special character (@$!%*?&)!";
        }

        $("#password-error").text(error);
        return error === "";
    }

    function validateConfirmPassword() {
        let password = $("#password").val();
        let cpassword = $("#cpassword").val();
        let error = "";

        if (cpassword === "") {
            error = "Confirm password is mandatory!";
        } else if (password !== cpassword) {
            error = "Passwords do not match!";
        }

        $("#cpassword-error").text(error);
        return error === "";
    }

    function validateProfilePic() {
        let file = $("#profilePic")[0].files[0];
        let error = "";

        if (!file) {
            error = "Profile picture is mandatory!";
        } else if (!allowedExtensions.test(file.name)) {
            error = "Only JPG, JPEG, PNG allowed!";
        } else if (file.size > 1048576) {
            error = "File size must be less than 1MB!";
        }

        $("#profilepic-error").text(error);
        return error === "";
    }


    /* ===== Form Validation on Submit ===== */
    $("#regForm").submit(function (event) {
        event.preventDefault();

        // Clear previous error messages
        $(".error-msg").text("");

        // Check department
        let dept = $("#department").val();
        if (dept === "") {
            alert("Please select a department!");
            return;
        }

        // Validate all fields
        let isValidFname = validateFirstName();
        let isValidMname = validateMiddleName();
        let isValidLname = validateLastName();
        let isValidEmail = validateEmail();
        let isValidPassword = validatePassword();
        let isValidCpassword = validateConfirmPassword();
        let isValidProfilePic = validateProfilePic();

        // If all validations pass
        if (isValidFname && isValidMname && isValidLname && isValidEmail && isValidPassword && isValidCpassword && isValidProfilePic) {
            alert("Form submitted successfully!");
            $("#regForm")[0].reset();
            // Reset department styling
            $("#department").val("");
            $(".form-label").removeClass("it-label hr-label intern-label");
            $(".form-input").removeClass("it-input hr-input intern-input");
        }
    });

});

// Show password rules on focus
$(document).on("focus", "#password", function () {
    $("#passwordRules").addClass("show");
});

// Hide when focus lost
$(document).on("blur", "#password", function () {
    $("#passwordRules").removeClass("show");
});




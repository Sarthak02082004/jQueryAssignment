/**
 * Registration Form Validation Script
 * Handles real-time validation, form submission, department theming, and UI interactions
 */

$(document).ready(function () {

    // ========================================
    // VALIDATION PATTERNS & CONSTANTS
    // ========================================
    
    const VALIDATION_RULES = {
        namePattern: /^[A-Za-z]+$/,
        emailPattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|in|edu|mil)$/,
        imageExtensions: /(\.jpg|\.jpeg|\.png)$/i,
        maxFileSize: 1048576, // 1MB in bytes
        minPasswordLength: 8
    };

    const DEPARTMENT_THEMES = {
        it: { label: "it-label", input: "it-input", selected: "it-selected" },
        hr: { label: "hr-label", input: "hr-input", selected: "hr-selected" },
        intern: { label: "intern-label", input: "intern-input", selected: "intern-selected" }
    };

    const TOAST_DURATION = 3000; // milliseconds

    // ========================================
    // HELPER FUNCTIONS
    // ========================================

    /**
     * Set error message and visual styling for a field
     * @param {string} fieldId - The ID of the input field
     * @param {string} error - The error message to display
     */
    function setFieldError(fieldId, error) {
        const $field = $(`#${fieldId}`);
        const $errorMsg = $(`#${fieldId}-error`);

        $errorMsg.text(error);
        if (error !== "") {
            $field.addClass("input-error");
        } else {
            $field.removeClass("input-error");
        }
    }

    /**
     * Apply department theme colors to form elements
     * @param {string} department - The selected department (it, hr, intern)
     */
    function applyDepartmentTheme(department) {
        const $labels = $(".form-label");
        const $inputs = $(".form-input");
        const $deptSelect = $("#department");

        // Remove all existing theme classes
        $labels.removeClass("it-label hr-label intern-label");
        $inputs.removeClass("it-input hr-input intern-input");
        $deptSelect.removeClass("it-selected hr-selected intern-selected");

        // Apply new theme if department selected
        if (department && DEPARTMENT_THEMES[department]) {
            const theme = DEPARTMENT_THEMES[department];
            $labels.addClass(theme.label);
            $inputs.addClass(theme.input);
            $deptSelect.addClass(theme.selected);
        }
    }

    /**
     * Toggle password field visibility
     * @param {string} fieldId - The password field ID
     */
    function togglePasswordVisibility(fieldId) {
        const $field = $(`#${fieldId}`);
        const $icon = $field.siblings(".toggle-icon");
        const isPassword = $field.attr("type") === "password";

        $field.attr("type", isPassword ? "text" : "password");
        $icon.toggleClass("fa-eye fa-eye-slash");
    }

    /**
     * Show success toast notification
     */
    function showSuccessToast() {
        const $toast = $("#successToast");
        $toast.addClass("show");

        // Auto-hide after specified duration
        setTimeout(() => {
            $toast.removeClass("show");
        }, TOAST_DURATION);
    }

    /**
     * Clear all form inputs and reset styling
     */
    function clearFormCompletely() {
        // Reset form inputs
        $("#regForm")[0].reset();

        // Clear all error messages and error classes
        $(".error-msg").text("");
        $(".form-input").removeClass("input-error");
        $("#profilePic").removeClass("input-error");

        // Reset department selection and styling
        $("#department").val("");
        applyDepartmentTheme(null);
        $("#department-error").text("");
    }

    // ========================================
    // DEPARTMENT SELECTOR HANDLER
    // ========================================

    $("#department").change(function () {
        const selectedDept = $(this).val();

        // Clear department error, error class, and apply new theme
        $("#department-error").text("");
        $("#department").removeClass("department-error input-error");
        applyDepartmentTheme(selectedDept);

        // Blur dropdown to remove focus immediately
        $(this).blur();
    });

    // ========================================
    // PASSWORD VISIBILITY TOGGLE
    // ========================================

    $("#togglePass").click(function () {
        togglePasswordVisibility("password");
    });

    $("#toggleCPass").click(function () {
        togglePasswordVisibility("cpassword");
    });

    // ========================================
    // PASSWORD REAL-TIME VALIDATION
    // ========================================

    /**
     * Display password validation requirements in real-time
     */
    function displayPasswordErrors() {
        const password = $("#password").val();
        const requirements = [
            { regex: /.{8,}/, msg: "Password must be of atleast 8 characters" },
            { regex: /[A-Z]/, msg: "Need one uppercase letter" },
            { regex: /[a-z]/, msg: "Need one lowercase letter" },
            { regex: /[0-9]/, msg: "Need one number" },
            { regex: /[@$!%*?&]/, msg: "Need one special character (@$!%*?&)" }
        ];

        const failedRequirements = requirements.filter(req => !req.regex.test(password));

        if (failedRequirements.length > 0) {
            const errorList = failedRequirements
                .map(req => `<div>• ${req.msg}</div>`)
                .join("");
            $("#password-error").html(errorList);
            $("#password").addClass("input-error");
        } else {
            $("#password-error").html("");
            $("#password").removeClass("input-error");
        }
    }

    $("#password").on("focus", displayPasswordErrors);
    $("#password").on("input", displayPasswordErrors);
    $("#password").on("blur", function () {
        $("#password-error").html("");
    });

    // ========================================
    // FIELD VALIDATION FUNCTIONS
    // ========================================

    /**
     * Validate first name field
     */
    function validateFirstName() {
        const fname = $("#fname").val().trim();
        let error = "";

        if (fname === "") {
            error = "First name is mandatory!";
        } else if (!VALIDATION_RULES.namePattern.test(fname)) {
            error = "No spaces or special characters allowed!";
        }

        setFieldError("fname", error);
        return error === "";
    }

    /**
     * Validate middle name field (optional field)
     */
    function validateMiddleName() {
        const mname = $("#mname").val().trim();
        let error = "";

        if (mname !== "" && !VALIDATION_RULES.namePattern.test(mname)) {
            error = "No spaces or special characters allowed!";
        }

        setFieldError("mname", error);
        return error === "";
    }

    /**
     * Validate last name field
     */
    function validateLastName() {
        const lname = $("#lname").val().trim();
        let error = "";

        if (lname === "") {
            error = "Last name is mandatory!";
        } else if (!VALIDATION_RULES.namePattern.test(lname)) {
            error = "No spaces or special characters allowed!";
        }

        setFieldError("lname", error);
        return error === "";
    }

    /**
     * Validate email field
     */
    function validateEmail() {
        const email = $("#email").val().trim();
        let error = "";

        if (email === "") {
            error = "Email is mandatory!";
        } else if (!VALIDATION_RULES.emailPattern.test(email)) {
            error = "Invalid email format! Use .com/.org/.in/.edu/.mil";
        }

        setFieldError("email", error);
        return error === "";
    }

    /**
     * Validate password field
     */
    function validatePassword() {
        const password = $("#password").val();
        let error = "";

        if (password.length < VALIDATION_RULES.minPasswordLength) {
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

        setFieldError("password", error);
        return error === "";
    }

    /**
     * Validate confirm password field
     */
    function validateConfirmPassword() {
        const password = $("#password").val();
        const cpassword = $("#cpassword").val();
        let error = "";

        if (cpassword === "") {
            error = "Confirm password is mandatory!";
        } else if (password !== cpassword) {
            error = "Passwords do not match!";
        }

        setFieldError("cpassword", error);
        return error === "";
    }

    /**
     * Validate profile picture file
     */
    function validateProfilePic() {
        const file = $("#profilePic")[0].files[0];
        let error = "";

        if (!file) {
            error = "Profile picture is mandatory!";
        } else if (!VALIDATION_RULES.imageExtensions.test(file.name)) {
            error = "Only JPG, JPEG, PNG allowed!";
        } else if (file.size > VALIDATION_RULES.maxFileSize) {
            error = "File size must be less than 1MB!";
        }

        setFieldError("profilepic", error);
        return error === "";
    }

    // ========================================
    // REAL-TIME FIELD VALIDATION LISTENERS
    // ========================================

    $("#fname").on("input", validateFirstName);
    $("#mname").on("input", validateMiddleName);
    $("#lname").on("input", validateLastName);
    $("#email").on("input", validateEmail);
    $("#cpassword").on("input", validateConfirmPassword);
    $("#profilePic").on("change", validateProfilePic);

    // ========================================
    // FORM SUBMISSION HANDLER
    // ========================================

    $("#regForm").submit(function (event) {
        event.preventDefault();

        // Step 1: Validate department selection
        const selectedDept = $("#department").val();
        if (selectedDept === "") {
            setFieldError("department", "Select your department!");
            $("#department").addClass("department-error").focus();
            return;
        }
        setFieldError("department", "");
        $("#department").removeClass("department-error");

        // Step 2: Validate all form fields
        const validationResults = {
            fname: validateFirstName(),
            mname: validateMiddleName(),
            lname: validateLastName(),
            email: validateEmail(),
            password: validatePassword(),
            cpassword: validateConfirmPassword(),
            profilepic: validateProfilePic()
        };

        // Step 3: Find and focus on the first field with error
        const fieldOrder = ["fname", "mname", "lname", "email", "password", "cpassword", "profilepic"];
        for (const field of fieldOrder) {
            if (!validationResults[field]) {
                $(`#${field}`).focus();
                return;
            }
        }

        // Step 4: If all validations pass, clear form and show success message
        clearFormCompletely();
        showSuccessToast();
    });

});




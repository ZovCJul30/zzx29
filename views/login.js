$(function () {
	var username_pattern = /^[a-z0-9]\w{3,11}$/;
	var password_pattern = /\w{6,12}/;

	function clearError() {
		$(".error").text("");
	}

	function showError(message) {
		$(".error").text(message).fadeIn();
	}

	function validateForm(username, password) {
		clearError();
		if (!username || !password) {
			showError("用户名或密码不能为空");
			return false;
		}
		if (!username_pattern.test(username)) {
			showError("用户名格式不正确");
			return false;
		}
		if (!password_pattern.test(password)) {
			showError("密码格式不正确");
			return false;
		}
		return true;
	}

	function handleLoginSuccess(response) {
		sessionStorage.setItem("nickname", response.data.user.nickname);
		sessionStorage.setItem("id", response.data.user.id);
		sessionStorage.setItem("token", response.data.token);
		window.location.href = "./index.html";
	}

	function handleLoginFailure(response) {
		showError(response.data.message);
	}

	$("form").on("submit", function (e) {
		e.preventDefault();

		const username = $('input[name="username"]').val();
		const password = $('input[name="password"]').val();

		if (validateForm(username, password)) {
			axios
				.post("http://localhost:9000/users/login", { username, password })
				.then(function (response) {
					if (response.data.code === 1) {
						handleLoginSuccess(response);
					} else {
						handleLoginFailure(response);
					}
				});
		}
	});
});

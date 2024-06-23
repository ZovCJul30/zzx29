$(function () {
	$("form").on("submit", e => {
		e.preventDefault();

		const validation = validateForm();
		if (!validation.isValid) return;

		registerUser(validation.data);
	});

	function validateForm() {
		const inputs = {
			username: $(".username").val(),
			password: $(".password").val(),
			rpassword: $(".rpassword").val(),
			nickname: $(".nickname").val(),
		};

		const { username, password, rpassword, nickname } = inputs;

		const usernamePattern = /^[a-z0-9]\w{3,11}$/;
		const passwordPattern = /\w{6,12}/;
		const nicknamePattern = /^[\u4e00-\u9fa5]{2,5}$/;

		let errorMessage;

		if (!usernamePattern.test(username))
			errorMessage = "用户名格式错误，需为字母或数字且长度在4至12之间。";
		else if (!passwordPattern.test(password))
			errorMessage = "密码格式错误，需为6至12位的字母或数字。";
		else if (password !== rpassword) errorMessage = "两次输入的密码不一致。";
		else if (!nicknamePattern.test(nickname))
			errorMessage = "昵称必须为2至5个中文字符。";

		if (errorMessage) {
			showError(errorMessage);
			return { isValid: false };
		}

		return { isValid: true, data: { username, password, nickname, rpassword } };
	}

	function showError(message) {
		$(".error").text(message).show();
	}

	function registerUser(userData) {
		axios
			.post("http://localhost:9000/users/register", userData)
			.then(({ data }) => {
				if (data.code === 1) {
					alert(`注册成功，即将跳转至登录页面...`);
					window.location.href = "login.html";
				} else {
					alert("注册失败，请稍后重试。");
				}
			})
			.catch(err => {
				console.error("注册请求出错:", err);
				alert("注册过程中遇到错误，请检查网络或稍后重试。");
			});
	}
});

$(function () {
	const userId = sessionStorage.getItem("id");
	const authToken = sessionStorage.getItem("token");

	initForm(userId, authToken);
});

function initForm(userId, authToken) {
	$("form").submit(function (event) {
		event.preventDefault(); // 阻止表单默认提交行为

		const currentPassword = $(".oldpassword").val().trim();
		const newPassword = $(".newpassword").val().trim();
		const rnewpassword = $(".rnewpassword").val().trim();

		if (validatePasswordChange(newPassword, rnewpassword)) {
			updatePassword(
				userId,
				authToken,
				currentPassword,
				newPassword,
				rnewpassword
			);
		}
	});
}

function validatePasswordChange(newPassword, rnewpassword) {
	if (newPassword !== rnewpassword) {
		displayErrorMessage("新密码与确认密码不匹配。");
		return false;
	}

	if (!isPasswordValid(newPassword)) {
		displayErrorMessage("新密码必须为6-12位字母或数字。");
		return false;
	}

	return true;
}

function isPasswordValid(password) {
	const passwordPattern = /^\w{6,12}$/;
	return passwordPattern.test(password);
}

function updatePassword(
	userId,
	authToken,
	currentPassword,
	newPassword,
	rnewpassword
) {
	axios
		.post(
			"http://localhost:9000/users/rpwd",
			{
				id: userId,
				oldPassword: currentPassword,
				newPassword: newPassword,
				rNewPassword: rnewpassword, // 确保前后一致，尽管参数名可能需调整
			},
			{
				headers: { authorization: authToken },
			}
		)
		.then(handlePasswordUpdateResponse)
		.catch(logErrorAndAlertUser);
}

function handlePasswordUpdateResponse(response) {
	if (response.data.code === 1) {
		$(".error").text(response.data.message).show();
		clearSessionStorageAndRedirectToLogin();
	} else {
		displayErrorMessage(response.data.message);
	}
}

function clearSessionStorageAndRedirectToLogin() {
	sessionStorage.clear();
	window.location.href = "./login.html";
}

function displayErrorMessage(message) {
	$(".error").text(message).show();
}

function logErrorAndAlertUser(error) {
	console.error("请求失败:", error);
	displayErrorMessage("更新密码失败，请稍后再试。");
}

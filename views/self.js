$(function () {
	const id = sessionStorage.getItem("id");
	const token = sessionStorage.getItem("token");
	queryUserInfo(id, token);

	$("form").on("submit", function (e) {
		e.preventDefault();
		const { age, gender, nickname } = getTrimmedFormData();
		updateUser(id, age, gender, nickname, token);
		return false;
	});

	function queryUserInfo(id, token) {
		axios
			.get(`http://localhost:9000/users/info?id=${id}`, {
				headers: { authorization: token },
			})
			.then(handleGetUserResponse);
	}

	function updateUser(id, age, gender, nickname, token) {
		axios
			.post(
				"http://localhost:9000/users/update",
				{
					id,
					age,
					gender,
					nickname,
				},
				{
					headers: { authorization: token },
				}
			)
			.then(handleUpdateUserResponse, handleRes);
	}

	function handleGetUserResponse(response) {
		if (response.data.code === 1) {
			const { username, age, gender, nickname } = response.data.user;
			$(".username").val(username);
			$(".age").val(age);
			$(".gender").val(gender);
			$(".nickname").val(nickname);
		}
	}

	function handleUpdateUserResponse(response) {
		if (response.data.code === 1) {
			sessionStorage.setItem("nickname", response.data.user.nickname);
			handleRes(response);
		} else {
			handleRes(response);
		}
	}

	function handleRes(res) {
		if (res.data.code === 1) {
			alert(res.data.message);
		} else {
			$(".error").text(res.data.message).show();
		}
	}

	function getTrimmedFormData() {
		return {
			age: $(".age").val().trim(),
			gender: $(".gender").val().trim(),
			nickname: $(".nickname").val().trim(),
		};
	}
});

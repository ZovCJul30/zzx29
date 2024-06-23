$(function () {
	initPage();
});

function initPage() {
	showOnOff();
	showUser();
	getCarousel();
	setupLogout();
	setupSelfPageNavigation();
}

function setupLogout() {
	$(".logout").click(function () {
			const userId = sessionStorage.getItem("id");
			const token = sessionStorage.getItem("token");
			logout(userId, token);
	});
}

function setupSelfPageNavigation() {
	$(".self").click(function () {
			redirectToSelfPage();
	});
}

function logout(userId, token) {
	axios.get(`http://localhost:9000/users/logout?id=${userId}`, {
			headers: {
					Authorization: token,
			},
	})
	.then(logoutResponse => {
			if (logoutResponse.data.code === 1) {
					clearSessionStorage();
					redirectToIndexPage();
			}
	});
}

function clearSessionStorage() {
	sessionStorage.clear();
}

function redirectToIndexPage() {
	window.location.href = "./index.html";
}

function redirectToSelfPage() {
	window.location.href = "./self.html";
}

function getCarousel() {
	axios.get("http://localhost:9000/carousel/list")
	.then(response => {
			const images = response.data.list
					.map(item => `<div><img src="http://localhost:9000/${item.name}" /></div>`)
					.join("");
			const carouselHtml = `<div carousel-item>${images}</div>`;

			$("#carousel").html(carouselHtml);
			setupCarousel();
	});
}

function setupCarousel() {
	layui.carousel.render({
			elem: "#carousel",
			width: "1200px",
			height: "600px",
			arrow: "hover",
			anim: "fade",
	});
}

function showUser() {
	const nickname = sessionStorage.getItem("nickname");
	if (nickname) {
			$(".nickname").text(nickname);
	}
}

function showOnOff() {
	const nickname = sessionStorage.getItem("nickname");
	if (nickname) {
			$(".on").addClass("active").siblings().removeClass("active");
	} else {
			$(".off").addClass("active").siblings().removeClass("active");
	}
}
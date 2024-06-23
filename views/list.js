$(function () {
	function loadCategories() {
		axios.get("http://localhost:9000/goods/category").then(function (res) {
			if (res.data.code === 1) {
				const categoriesHTML =
					`<li class="${ACTIVE_CLASS}">全部</li>` +
					res.data.list.map(item => `<li>${item}</li>`).join("");
				$(".category").html(categoriesHTML);
			} else {
				alert(res.data.message);
			}
		});
	}

	loadCategories();
	// 定义请求参数
	let totalPage = 0;
	let params = {
		current: 1,
		pagesize: 12,
		category: "",
		filter: "",
		saleType: 10,
		sortType: "id",
		sortMethod: "ASC",
		search: "",
	};

	// 绑定点击事件
	$(".category").on("click", "li", function () {
		$(".category li").removeClass("active");
		$(this).addClass("active");
		params.category = $(this).text();
		if (params.category === "全部") params.category = "";
		params.current = 1;
		getList();
	});
	$(".saleBox").on("click", "li", function () {
		const activeClass = "active";
		$(".saleBox li").removeClass(activeClass);
		$(this).addClass(activeClass);
		params.saleType = $(this).data("type");
		params.current = 1;
		getList();
	});

	$(".hotBox").on("click", "li", function () {
		const activeClass = "active";
		$(".hotBox li").removeClass(activeClass);
		$(this).addClass(activeClass);
		params.filter = $(this).data("type");
		params.current = 1;
		getList();
	});

	$(".sortBox").on("click", "li", function () {
		const activeClass = "active";
		$(".sortBox li").removeClass(activeClass);
		$(this).addClass(activeClass);
		params.sortType = $(this).data("type");
		params.sortMethod = $(this).data("method");
		params.current = 1;
		getList();
	});

	// 搜索框事件
	$(".search").on("blur", function () {
		params.search = this.value;
		getList();
	});

	// 跳转到指定页码
	$(".go").on("click", function () {
		let pageNum = parseInt($(".jump").val(), 10);
		if (!isNaN(pageNum) && pageNum > 0) {
			params.current = pageNum;
			getList();
		} else {
			alert("请输入有效的页码");
		}
	});

	// 每页显示数量变更
	$(".pagesize").on("change", function () {
		params.pagesize = parseInt($(this).val(), 10);
		params.current = 1;
		getList();
	});

	$(".first").on("click", function () {
		params.current = 1;
		getList();
		$(this).addClass("disable");
	});

	$(".last").on("click", function () {
		params.current = totalPage;
		getList();
		$(this).addClass("disable");
	});

	$(".pagination").on("click", ".next, .prev", function () {
		if ($(this).hasClass("next")) {
			if (params.current < totalPage) {
				params.current++;
				$(".prev").removeClass("disable");
				getList();
			}
		} else if ($(this).hasClass("prev")) {
			if (params.current > 1) {
				params.current--;
				if (params.current === 1) {
					$(".prev").addClass("disable");
				}
				getList();
			}
		}
	});

	// 获取商品列表
	function getList() {
		axios
			.get("http://localhost:9000/goods/list", { params: params })
			.then(function (res) {
				if (res.data.code === 1) {
					let html = res.data.list
						.map(function (product) {
							return `
                      <li data-id="${product.goods_id}">
                          <div class="show">
                              <img src="${product.img_big_logo}">
                              ${
																product.is_hot
																	? '<span class="hot">热销</span>'
																	: ""
															}
                              ${product.is_sale ? "<span>折扣</span>" : ""}
                          </div>
                          <div class="info">
                              <p class="title">${product.title}</p>
                              <p class="price">
                                  <span class="curr">¥${
																		product.current_price
																	}</span>
                                  <span class="old">¥${product.price}</span>
                              </p>
                          </div>
                      </li>
                  `;
						})
						.join("");
					$(".list.container").html(html);
					$(".total").text(`${params.current}/${res.data.total}`);
					totalPage = res.data.total; // 更新总页数
					updateFirstAndLast();
				} else {
					alert(res.data.message);
				}
			});
	}

	getList();

	// 商品详情点击事件
	$(".list.container").on("click", "li", function () {
		let id = $(this).data("id");
		sessionStorage.setItem("goodsid", id);
		window.location.href = "./detail.html";
	});

	function updateFirstAndLast() {
		if (params.current === 1) {
			$(".first").addClass("disable");
			$(".prev").addClass("disable");
		} else {
			$(".first").removeClass("disable");
			$(".prev").removeClass("disable");
		}

		if (params.current !== totalPage) {
			$(".last").removeClass("disable");
			$(".next").removeClass("disable");
		} else {
			$(".last").addClass("disable");
			$(".next").addClass("disable");
		}
	}
});

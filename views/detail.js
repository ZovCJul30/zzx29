$(function () {
	const goodsId = sessionStorage.getItem("goodsid");
	if (!goodsId) {
		alert("商品信息不存在");
		return;
	}
	axios.get(`http://localhost:9000/goods/item/${goodsId}`).then(function (res) {
		if (res.data.code === 1) {
			const goods = res.data.info;
			$(".middleimg").attr("src", goods.img_big_logo);
			$(".title").text(goods.title);
			$(".old").text(goods.price);
			$(".discount").text(goods.sale_type);
			$(".curprice").text(goods.current_price);
			$(".desc").html(goods.goods_introduce);
		} else {
			alert(res.data.message);
		}
	});
});

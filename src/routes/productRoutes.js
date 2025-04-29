// Lấy danh sách sản phẩm
router.get("/", (req, res) => {
    const query = "SELECT id, name, price, id_discount, created_date FROM product";

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

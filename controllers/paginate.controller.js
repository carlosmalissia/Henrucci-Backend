import Product from "../models/product.model.js";

const paginate = async (req, res) => {
    let products = [];
    if (req.products) {
        products = req.products;
    }
    else{
        products = await Product.find({ isDeleted: false})
        .populate({
            path: "category",
            select: "name",
        })
        .populate({
            path: "reviews",
            select: "user rating comment",
            populate: { path: "user", select: "name lastname email" },
        });
    }
    try {
        let {itemsperpage, actualpage} = req.query;
        if (itemsperpage && actualpage) {
            const totalPages = Math.ceil(products.length/itemsperpage);
                const lastIndex = actualpage * itemsperpage;
                const firstIndex = lastIndex - itemsperpage;
                const page = products.slice(firstIndex, lastIndex);
            res.status(200).json({totalPages, products: page});
        }
        else res.status(400).json({error: "itemsperpage and actualpage is required"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

export default { paginate };
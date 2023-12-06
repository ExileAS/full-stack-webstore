const stripe = require("stripe")(process.env.STRIPE_KEY);
const { OrderedProductModel } = require("../models/oderedProductsModel");
const userModel = require("../models/userModel");

module.exports.payment_post = async (req, res) => {
  const { confirmId } = req.body;
  try {
    const order = await OrderedProductModel.findOne({ confirmId: confirmId });
    const id = order._id;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: order.list.map((product) => {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
            },
            unit_amount: product.price,
          },
          quantity: product.count,
        };
      }),
      success_url: `http://localhost:3000/products/ordered/confirmed/${id}`,
      cancel_url: "http://localhost:3000/products/ordered/checkout",
    });
    res.json({ url: session.url, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.confirm_payment = async (req, res) => {
  const { confirmId, currUser } = req.body;

  try {
    const order = await OrderedProductModel.findOneAndUpdate(
      { confirmId: confirmId, "customerInfo.userEmail": currUser },
      {
        $set: {
          customerPayed: true,
          shipmentStartedAt: Date.now(),
        },
      }
    );

    const updatedOrder = await OrderedProductModel.findById({ _id: order._id });
    res.status(200).json({
      startedAt: updatedOrder.shipmentStartedAt.toUTCString(),
    });
    console.log(order);
    const totalPayment = updatedOrder.list.reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    const updatedPaymentOrder = await OrderedProductModel.findByIdAndUpdate(
      { _id: updatedOrder._id },
      { $set: { total: totalPayment } }
    );
    const user = await userModel.findOne({ email: currUser });
    // console.log("user: ", user.orders, "updated: ", updatedPaymentOrder);
    const existingOrder = user?.orders.find(
      (order) => order.orderId === confirmId
    );

    const newOrder = {
      orderId: confirmId,
      list: updatedPaymentOrder.list,
      total: totalPayment,
    };

    let userOrder;

    if (existingOrder) {
      console.log("existing");
      userOrder = await userModel.findOneAndUpdate(
        { email: currUser },
        { $set: { "orders.$[order]": newOrder } },
        { arrayFilters: [{ "order.orderId": confirmId }] }
      );
    } else {
      console.log("new");
      userOrder = await userModel.findOneAndUpdate(
        { email: currUser },
        {
          $push: { orders: newOrder },
        }
      );

      const totalUserPayments = userOrder.orders.reduce(
        (acc, val) => acc + val.total,
        0
      );

      await userModel.findByIdAndUpdate(
        { _id: userOrder._id },
        {
          $inc: { purchaseCount: 1 },
          $set: { totalPayments: totalUserPayments },
        }
      );
    }
  } catch (err) {
    // res.status(400).json({ err });
    console.log(err);
  }
};

db = db.getSiblingDB('nombrebase');
db.createCollection("my-empty-collection");
db.strategyitems.insert({ symbol: "chf", eval_period: 15, buy_booster: 8.0, sell_booster: 5.0, buy_lot: 0.2, sell_lot: 0.2 });

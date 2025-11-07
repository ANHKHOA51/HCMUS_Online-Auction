export const fakeFetchItems = (count = 5, delayMs = 10) => {
  const baseItem = {
    title: "Item A",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1598",
    cur_price: 100000,
    bidder: "Nguyen Van A",
    instant_price: 200000,
    time_publish: "2025-11-06T10:30:00Z",
    time_end: "2025-11-06T10:30:00Z",
    num_bid: 10,
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      const items = Array.from({ length: count }, (_, idx) => ({
        ...baseItem,
        title: `Item ${String.fromCharCode(65 + idx)}`,  // Item A, Item B, Item C, ...
        cur_price: baseItem.cur_price + idx * 50000,
        bidder: `Bidder ${idx + 1}`,
        num_bid: baseItem.num_bid + idx,
      }));
      resolve(items);
    }, delayMs);
  });
}
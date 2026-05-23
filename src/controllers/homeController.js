export function getHomePage(_req, res) {
  res.render("index", {
    title: "Home",
    heading: "Welcome to the CSE 340 Service Network!",
    description:
      "Our mission is to promote service across the world by connecting volunteers with service opportunities in their community.",
    homeImage: {
      src: "/images/cse340-service-network.png",
      alt: "CSE 340 Service Network Logo",
    },
  });
}

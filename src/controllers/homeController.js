export function getHomePage(_req, res) {
  res.render("index", {
    title: "Home",
    heading: "Welcome to the CSE 340 Service Network!",
    description:
      "We connect volunteers with local organizations that need a helping hand.",
    homeImage: {
      src: "/images/cse340-service-network.png",
      alt: "Illustration for the CSE 340 Service Network",
    },
  });
}

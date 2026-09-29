export const homePage = (req, res) => {
  res.render('home', { title: 'Home' });
};

export const aboutPage = (req, res) => {
  res.render('about', { title: 'About Us' });
};

export const contactPage = (req, res) => {
  res.render('contact', { title: 'Contact Us' });
};

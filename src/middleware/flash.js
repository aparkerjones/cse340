const emptyFlashMessages = () => ({
  success: [],
  error: [],
  warning: [],
  info: [],
});

const flashMiddleware = (req, _res, next) => {
  req.flash = (type, message) => {
    if (!req.session.flash) {
      req.session.flash = emptyFlashMessages();
    }

    if (type && message) {
      if (!req.session.flash[type]) {
        req.session.flash[type] = [];
      }
      req.session.flash[type].push(message);
      return;
    }

    if (type) {
      const messages = req.session.flash[type] || [];
      req.session.flash[type] = [];
      return messages;
    }

    const allMessages = req.session.flash;
    req.session.flash = emptyFlashMessages();
    return allMessages;
  };

  next();
};

const flashLocals = (req, res, next) => {
  res.locals.flash = req.flash;
  next();
};

const flash = (req, res, next) => {
  flashMiddleware(req, res, () => {
    flashLocals(req, res, next);
  });
};

export default flash;

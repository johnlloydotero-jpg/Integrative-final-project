let links = [];

// CREATE
exports.createLink = (req, res) => {
  const newLink = {
    id: Date.now().toString(),
    ...req.body
  };

  links.push(newLink);
  res.status(201).json(newLink);
};

// READ
exports.getLinks = (req, res) => {
  res.json(links);
};

// UPDATE
exports.updateLink = (req, res) => {
  const { id } = req.params;

  links = links.map(link =>
    link.id === id ? { ...link, ...req.body } : link
  );

  res.json({ message: "Updated" });
};

// DELETE
exports.deleteLink = (req, res) => {
  const { id } = req.params;

  links = links.filter(link => link.id !== id);

  res.json({ message: "Deleted" });
};
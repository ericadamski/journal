import Journal from "../../services/journal";

export default async (req, res) => {
  res.json(await Journal.add(req.body));
};

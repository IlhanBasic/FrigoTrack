import Partner from "../models/partner.model.js";

export const getAllPartners = async (req, res) => {
  try {
    const partners = await Partner.find();
    res.status(200).json(partners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPartnerById = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) {
      return res.status(404).json({ message: "Partner nije pronadjen." });
    }
    res.status(200).json(partner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPartner = async (req, res) => {
  const { name, address, phone, pibOrJmbg, type } = req.body;

  if (!name || !address || !phone || !pibOrJmbg || !type) {
    return res
      .status(400)
      .json({
        message:
          "Nedostaju neka polja: name, address, phone, pibOrJmbg, type.",
      });
  }

  try {
    const existingPartner = await Partner.findOne({ pibOrJmbg });
    if (existingPartner) {
      return res
        .status(400)
        .json({ message: "Partner sa tim PIB/JMBG već postoji." });
    }

    const partner = new Partner(req.body);
    await partner.save();
    res.status(201).json(partner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePartner = async (req, res) => {
  try {
    const partner = await Partner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!partner) {
      return res.status(404).json({ message: "Partner nije pronadjen." });
    }
    res.status(200).json(partner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePartner = async (req, res) => {
  try {
    const partner = await Partner.findByIdAndDelete(req.params.id);
    if (!partner) {
      return res.status(404).json({ message: "Partner nije pronadjen." });
    }
    res.status(200).json({ message: "Partner je uspešno obrisan." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uuid = require("uuid");
const path = require("path");
const { Device, DeviceInfo } = require("../models/models");
const ApiError = require("../error/ApiErrors");

async function create(req, res, next) {
  try {
    let { name, price, brandId, typeId, info } = req.body;
    const { img } = req.files;
    let fileName = uuid.v4() + ".jpg";
    img.mv(path.resolve(__dirname, "..", "static", fileName));
    const device = await Device.create({
      name,
      price,
      brandId,
      typeId,
      img: fileName,
    });

    if (info) {
      info = JSON.parse(info);
      info.forEach((el) =>
        DeviceInfo.create({
          title: el.title,
          description: el.description,
          deviceId: device.id,
        })
      );
    }

    return res.json(device);
  } catch (error) {
    next(ApiError.badRequest(error.message));
  }
}

async function getAll(req, res) {
  let { brandId, typeId, limit, page } = req.query;
  page = page || 1;
  limit = limit || 9;
  let offset = page * limit - limit;
  let devices;
  if (!brandId && !typeId) {
    devices = await Device.findAndCountAll({ limit, offset });
  }
  if (brandId && !typeId) {
    devices = await Device.findAndCountAll({
      where: { brandId },
      limit,
      offset,
    });
  }
  if (!brandId && typeId) {
    devices = await Device.findAndCountAll({
      where: { typeId },
      limit,
      offset,
    });
  }
  if (brandId && typeId) {
    devices = await Device.findAndCountAll({
      where: { brandId, typeId },
      limit,
      offset,
    });
  }
  return res.json(devices);
}

async function getOne(req, res) {
  const { id } = req.params;
  const device = await Device.findOne({
    where: { id },
    include: [{ model: DeviceInfo, as: "info" }],
  });
  return res.json(device);
}

async function delDevice(req, res) {
  const id = req.params.id;
  const device = await Device.query("DELETE FROM device where id = 1", [id]);
  res.json(device.rows[0]);
}

module.exports = { create, getAll, getOne, delDevice };

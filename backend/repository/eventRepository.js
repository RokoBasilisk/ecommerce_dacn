import EventModel from "../models/eventModel.js";
class EventRepository {
  async add(entity) {
    const entitySave = await EventModel.create(entity);
    await entitySave.save();
    return entitySave;
  }
  async get(condition) {
    return await EventModel.find(condition);
  }
}
const eventRepository = new EventRepository();

export default eventRepository;

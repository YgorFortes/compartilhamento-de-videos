import { VideoService } from "../services/VideoService.js";
import CrudControllerUtils from "../../../utils/crud/crudControllerUtils.js";
import { ValitatorSchemaVideo } from "../validators/ValitatorSchemaVideo.js";
 
export class  VideosController extends CrudControllerUtils {
  constructor(){
    super();
    this.videoService = new VideoService();
    this.validatorSchema = new ValitatorSchemaVideo();
  }

  findAll(){
    this.router.get('/', async (req, res, next) => {
      try {
        
        const filter = await this.validatorSchema.validateFilters(req.query);
        
        const videos = await this.videoService.findAll(filter);

        return res.status(200).send(videos);
      } catch (error) {
        next(error);
      }
    });
  }
}
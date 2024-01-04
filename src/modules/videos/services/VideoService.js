import { VideosRepository } from "../repository/videosRepository.js";
import { CrudServiceUtils } from "../../../utils/crud/crudServiceUtils.js";
import { ValitatorSchemaVideo } from "../validators/ValidatorSchemaVideo.js";
import { CustomError } from "../../app/erros/CustomError.js";
import { CategoryService } from "../../category/services/CategoryServices.js";

export class VideoService extends CrudServiceUtils{
  constructor(){
    super();
    this.videoRepository = new VideosRepository();
    this.validatorSchema = new ValitatorSchemaVideo();
    this.categoriaService = new CategoryService();
  }

  async findAll(filter){
   try {

    await this.validatorSchema.findAll(filter);
    
    const videos = await this.videoRepository.findAll(filter);

    return videos;

   } catch (error) {
    throw error;
   }
  }

  async findOne(videoId){
    try {
     await this.validatorSchema.findOne(videoId);

     const video = await this.videoRepository.findOne(videoId);

     if(!video){
      return [];
     }

     return video;

    } catch (error) {
      throw error;
    }
  }

  async create(videoData){
    try {
      await this.validatorSchema.create(videoData);

      const videoDataWithCategory = await this.verifyOrCreateCategoryForVideo(videoData);
    
      
      const newVideo = await this.videoRepository.create(videoDataWithCategory);

      if(!newVideo){
        throw CustomError('Não foi possível cadastrar o video', );
      }

      return newVideo;

    } catch (error) {
      throw error;
    }
  }

  async update(videoId, videoData){
    const {categoriaId} = videoData;
    try {

      await this.validatorSchema.update({params: videoId, body: videoData});

      const video = await this.findOne(videoId);

      if(video.length <1){
        throw new CustomError('Video não encontrado.', 404);
      }

      await this.verifyCategoryById(categoriaId);

      const newInfoVideo = await this.videoRepository.update(videoId, videoData);

      return newInfoVideo;

    } catch (error) {
      throw error;
    }
  }

  async delete(videoId){
    try {
      await this.validatorSchema.delete(videoId);

      const video = await this.findOne(videoId);
      
      if(video.length <1){
        throw new CustomError('Video não encontrado.', 404);
      }

      const result = await this.videoRepository.delete(videoId);

      if(result){
        return 'Video deletado com sucesso';
      }

    } catch (error) {
      throw error;
    }
  }

  async verifyOrCreateCategoryForVideo(videoData){
    const {categoriaId} = videoData;
    try {
      if(!categoriaId) {
        const titleFree = await this.categoriaService.findOrCreateTitle('livre');
        return {...videoData, categoriaId: titleFree.id};
      }

      await this.verifyCategoryById(categoriaId);
      
      return videoData;
    } catch (error) {
      throw error;
    }
  }

  async verifyCategoryById(categoriaId){
    if(categoriaId){
    
      const category = await this.categoriaService.findOne({id: categoriaId});

      if(category.length <1){
        throw new CustomError('Categoria não encontrado.', 404);
      }
    }
  }

}

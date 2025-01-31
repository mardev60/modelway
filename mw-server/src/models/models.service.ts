import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Model as ModelDocument } from '../utils/schemas/models.schema';

@Injectable()
export class ModelsService {
  constructor(
    @InjectModel(ModelDocument.name)
    private readonly modelModel: Model<ModelDocument>
  ) {}

  async findAll(): Promise<{ [key: string]: ModelDocument[] }> {
    const models = await this.modelModel.find().exec();
  
    const groupedByName = models.reduce((acc, model) => {
      if (!acc[model.name]) {
        acc[model.name] = [];
      }
      acc[model.name].push(model);
      return acc;
    }, {} as { [key: string]: ModelDocument[] });
  
    return groupedByName;
  }

  async findByGroup(groupName: string): Promise<ModelDocument[]> {
    const models = await this.modelModel.find().exec();
  
    const filteredModels = models.filter((model) => model.name === groupName);
  
    return filteredModels;
  }

  async create(modelData: Partial<ModelDocument>): Promise<ModelDocument> {
    const newModel = new this.modelModel(modelData);
    return newModel.save();
  }
}

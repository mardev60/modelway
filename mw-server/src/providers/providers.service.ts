import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Provider as ProviderDocument } from '../utils/schemas/providers.schema';
import { Model as ModelDocument } from '../utils/schemas/models.schema';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectModel(ProviderDocument.name)
    private readonly providerModel: Model<ProviderDocument>,
    @InjectModel(ModelDocument.name)
    private readonly modelModel: Model<ModelDocument>,
  ) {}

  async findAll(): Promise<ProviderDocument[]> {
    return this.providerModel.find().exec();

  }

  async getModelsGroupedByProvider() {
    const models = await this.modelModel.find().lean();
    const providers = await this.providerModel.find().lean();

    const grouped = {};
    providers.forEach((provider) => {
      grouped[provider.name] = models
        .filter((model) => model.provider_id === provider._id.toString())
        .map((model) => model);
    });

    return grouped;
  }
  
}

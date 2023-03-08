import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, PrismaClient } from '@prisma/client';

import { PaginatedResult } from '@core/prisma/interfaces/pagination-result.interface';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private configService: ConfigService) {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // this.$on('query', async (e) => {
    //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   // @ts-ignore
    //   // console.log(`${e.query} ${e.params}`);
    //   // console.log(e);
    // });
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  public buildUrl(
    resourceBaseUrl: string,
    resourceId: number | bigint | string,
  ): string {
    const baseUrl: string = this.configService.get<string>('BASE_URL');

    return `${baseUrl}${resourceBaseUrl}/${resourceId}`;
  }

  public async paginatedSearch<T, K>(
    model: {
      count: (args: any) => Prisma.PrismaPromise<number>;
      findMany: (args: any) => Prisma.PrismaPromise<T[]>;
    },
    findOptions: { where?: any; take?: number } & K,
    resourceUrl: string,
    queryParams: {
      [key: string]: [value: unknown];
    },
  ): Promise<PaginatedResult<T>> {
    const limit = Number(queryParams.limit) || 10;
    const page = Number(queryParams.page) || 1;
    const skip = page > 0 ? limit * (page - 1) : 0;
    const [totalItems, data] = await Promise.all([
      model.count({ where: findOptions.where }),
      model.findMany({
        ...findOptions,
        take: limit,
        skip,
      }),
    ]);
    const baseUrl: string = `${this.configService.get<string>(
      'BASE_URL',
    )}/${resourceUrl}?`;
    const lastPageNumber: number = Math.ceil(totalItems / limit);
    const nextPageNumber: number = page < lastPageNumber ? page + 1 : null;
    const previosPageNumber: number = page > 1 ? page - 1 : null;
    const queryParamsLink = this.constructQueryParamsLink(queryParams);
    const lastPageUrl: string = `${baseUrl}limit=${limit}&page=${lastPageNumber}${queryParamsLink}`;
    const nextPageUrl: string =
      (nextPageNumber &&
        `${baseUrl}limit=${limit}&page=${nextPageNumber}${queryParamsLink}`) ||
      null;
    const previousPageUrl: string =
      (previosPageNumber &&
        `${baseUrl}limit=${limit}&page=${previosPageNumber}${queryParamsLink}`) ||
      null;
    const firstPageUrl: string = `${baseUrl}limit=${limit}&page=${1}${queryParamsLink}`;
    const totalPages: number = Math.ceil(totalItems / limit);
    return {
      data,
      meta: {
        totalItems,
        page,
        limit,
        previousPageUrl,
        nextPageUrl,
        firstPageUrl,
        lastPageUrl,
        totalPages,
      },
    };
  }

  private constructQueryParamsLink(queryParams: {
    [key: string]: [value: unknown];
  }) {
    let finalString = '';

    for (const [key, value] of Object.entries(queryParams)) {
      finalString += `&${key}=${value}`;
    }

    return finalString;
  }
}

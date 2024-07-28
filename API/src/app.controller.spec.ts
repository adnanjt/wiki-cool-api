import { Test, TestingModule } from '@nestjs/testing';
import { WikiController } from './app.controller';
import { WikiService } from './app.service';
import { WikiGetAllQuery } from './query.dto';
import { validateOrReject } from 'class-validator';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';

jest.mock('class-validator');
jest.mock('./app.service');

describe('WikiController', () => {
  let wikiController: WikiController;
  let wikiService: WikiService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WikiController],
      providers: [WikiService],
    }).compile();

    wikiController = app.get<WikiController>(WikiController);
    wikiService = app.get<WikiService>(WikiService);
  });

  describe('getAll', () => {
    it('should return an array of Wiki', async () => {
      const query: WikiGetAllQuery = {
        language: 'en',
        date: '2023-07-28',
        targerLanguage: 'es',
      };
      const result = [
        {
          title: 'Example Article',
          image: {
            source: 'http://example.com/image.jpg',
            width: 800,
            height: 600,
          },
          description: 'This is an example article',
          related: 'Related content',
          type: 'article',
          contentUrl: 'http://example.com/content',
        },
      ];

      (validateOrReject as jest.Mock).mockResolvedValue(true);
      (wikiService.getAll as jest.Mock).mockResolvedValue(result);

      expect(await wikiController.getAll(query)).toBe(result);
    });

    it('should throw a validation error', async () => {
      const query: WikiGetAllQuery = {
        language: 'invalid', // Invalid language code
        date: 'invalid-date', // Invalid date format
      };
      const errors = new Error('Validation failed');

      (validateOrReject as jest.Mock).mockRejectedValue(errors);

      await expect(wikiController.getAll(query)).rejects.toThrow(
        new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Validation failed',
            errors,
          },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should throw a service error', async () => {
      const query: WikiGetAllQuery = {
        language: 'en',
        date: '2023-07-28',
        targerLanguage: 'es',
      };
      const errors = new Error('Service error');

      (validateOrReject as jest.Mock).mockResolvedValue(true);
      (wikiService.getAll as jest.Mock).mockRejectedValue(errors);

      await expect(wikiController.getAll(query)).rejects.toThrow(
        new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Service failed',
            errors,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('getAllTranslate', () => {
    it('should return an array of translated Wiki', async () => {
      const query: WikiGetAllQuery = {
        language: 'en',
        date: '2023-07-28',
        targerLanguage: 'es',
      };
      const language = 'fr';
      const result = [
        {
          title: 'Example Article',
          image: {
            source: 'http://example.com/image.jpg',
            width: 800,
            height: 600,
          },
          description: 'This is an example article',
          related: 'Related content',
          type: 'article',
          contentUrl: 'http://example.com/content',
        },
      ];

      (validateOrReject as jest.Mock).mockResolvedValue(true);
      (wikiService.postTranslate as jest.Mock).mockResolvedValue(result);

      expect(await wikiController.getAllTranslate(query, language)).toBe(
        result,
      );
    });

    it('should throw a validation error', async () => {
      const query: WikiGetAllQuery = {
        language: 'invalid', // Invalid language code
        date: 'invalid-date', // Invalid date format
      };
      const language = 'fr';
      const errors = new Error('Validation failed');

      (validateOrReject as jest.Mock).mockRejectedValue(errors);

      await expect(
        wikiController.getAllTranslate(query, language),
      ).rejects.toThrow(
        new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Validation failed',
            errors,
          },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should throw a service error', async () => {
      const query: WikiGetAllQuery = {
        language: 'en',
        date: '2023-07-28',
        targerLanguage: 'es',
      };
      const language = 'fr';
      const errors = new Error('Service error');

      (validateOrReject as jest.Mock).mockResolvedValue(true);
      (wikiService.postTranslate as jest.Mock).mockRejectedValue(errors);

      await expect(
        wikiController.getAllTranslate(query, language),
      ).rejects.toThrow(
        new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Service failed',
            errors,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
});

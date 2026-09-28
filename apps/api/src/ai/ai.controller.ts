import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AiService } from './ai.service';

export class NlpMarketPromptDto {
  prompt!: string;
}

@ApiTags('Bengali AI & Natural Language Market Builder')
@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('natural-language-market')
  @ApiOperation({ summary: 'Parse natural language Bengali/English prompt and build a custom monthly market' })
  async buildMarket(@Body() body: NlpMarketPromptDto) {
    return this.aiService.parseNaturalLanguageMarket(body.prompt);
  }
}

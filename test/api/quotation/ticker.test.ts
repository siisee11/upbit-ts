import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import nock from 'nock';
import axios from 'axios';
import path from 'path';
import { fetchTicker } from '../../../src/api/quotation/ticker';
import { DEFAULT_BASE_URL } from '../../../src/config/constants';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nockBack = nock.back;
nockBack.fixtures = path.join(__dirname, '__fixtures__');
nockBack.setMode('lockdown');

describe('fetchTicker', () => {
    const http = axios.create({ baseURL: DEFAULT_BASE_URL });

    it('should fetch ticker for a single market', async () => {
        const { nockDone } = await nockBack('ticker-single-market.json');

        try {
            const result = await fetchTicker(http, { markets: ['KRW-BTC'] });
            expect(result).toBeDefined();
            expect(result.length).toBe(1);
            expect(result[0].market).toBe('KRW-BTC');
        } finally {
            nockDone();
        }
    });

    it('should fetch ticker for multiple markets', async () => {
        const { nockDone } = await nockBack('ticker-multiple-markets.json');

        try {
            const result = await fetchTicker(http, { markets: ['KRW-BTC', 'KRW-ETH'] });
            expect(result).toBeDefined();
            expect(result.length).toBe(2);
            const markets = result.map(t => t.market);
            expect(markets).toContain('KRW-BTC');
            expect(markets).toContain('KRW-ETH');
        } finally {
            nockDone();
        }
    });

    it('should throw error when no markets are provided', async () => {
        await expect(fetchTicker(http, { markets: [] })).rejects.toThrow('At least one market is required for ticker.');
    });
});

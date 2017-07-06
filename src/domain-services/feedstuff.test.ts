// Imports
import { expect } from 'chai';
import * as co from 'co';
import 'mocha';
import * as sinon from 'sinon';

// Imports repositories
import { FeedstuffRepository } from './../domain-repositories/mock/feedstuff';

// Imports services
import { FeedstuffService } from './feedstuff';
import { CacheService } from './null-cache';

// Imports models
import { Feedstuff } from './../domain-models/feedstuff';

describe('FeedstuffService', function () {

    describe('listFeedstuffs', () => {
        it('should call feedstuffRepository.list', () => {
            return co(function* () {

                const feedstuffRepository = new FeedstuffRepository();
                const feedstuffRepositoryListSpy = sinon.spy(feedstuffRepository, 'list');
                const feedstuffService = new FeedstuffService(CacheService.getInstance(), feedstuffRepository, null);

                yield feedstuffService.listFeedstuffs();

                expect(feedstuffRepositoryListSpy.calledOnce).to.be.true;
            });
        });

        it('should throw exception when repository returns invalid feedstuffs', () => {
            return co(function* () {

                const feedstuffRepository = new FeedstuffRepository();
                sinon.stub(feedstuffRepository, 'list').callsFake(() => {
                    return Promise.resolve([
                        new Feedstuff(null, null, null, null, null)
                    ]);
                });
                
                const feedstuffService = new FeedstuffService(CacheService.getInstance(), feedstuffRepository, null);

                try {
                    yield feedstuffService.listFeedstuffs();
                    throw new Error('Expected Error');
                } catch (err) {
                    expect(err).to.be.not.null;
                    expect(err.message).to.be.eq('Validation Failed');
                }
            });
        });
    });

    describe('listExampleFeedstuffs', () => {
        it('should call feedstuffRepository.examples', () => {
            return co(function* () {

                const feedstuffRepository = new FeedstuffRepository();
                const feedstuffRepositoryExamplesSpy = sinon.spy(feedstuffRepository, 'examples');
                const feedstuffService = new FeedstuffService(CacheService.getInstance(), feedstuffRepository, null);

                yield feedstuffService.listExampleFeedstuffs();

                expect(feedstuffRepositoryExamplesSpy.calledOnce).to.be.true;
            });
        });

        it('should throw exception when repository returns invalid feedstuffs', () => {
            return co(function* () {

                const feedstuffRepository = new FeedstuffRepository();
                sinon.stub(feedstuffRepository, 'examples').callsFake(() => {
                    return Promise.resolve([
                        new Feedstuff(null, null, null, null, null)
                    ]);
                });
                
                const feedstuffService = new FeedstuffService(CacheService.getInstance(), feedstuffRepository, null);

                try {
                    yield feedstuffService.listExampleFeedstuffs();
                    throw new Error('Expected Error');
                } catch (err) {
                    expect(err).to.be.not.null;
                    expect(err.message).to.be.eq('Validation Failed');
                }
            });
        });
    });
});
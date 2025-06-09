const cron = require('node-cron');
const dataSourceService = require('./dataSourceService');

// 存储定时任务的引用
const scheduledJobs = new Map();

/**
 * 初始化所有定时任务
 */
function initializeJobs() {
  console.log('正在初始化定时任务...');
  
  // 每小时从新闻API获取数据
  scheduleNewsAPIFetch();
  
  // 每30分钟从RSS源获取数据
  scheduleRSSFetch();
  
  // 每天更新热门新闻状态
  scheduleTrendingUpdate();
  
  console.log('定时任务初始化完成');
}

/**
 * 安排从新闻API获取数据的任务
 */
function scheduleNewsAPIFetch() {
  // 每小时执行一次 (0 * * * *)
  const job = cron.schedule('0 * * * *', async () => {
    console.log('执行定时任务: 从新闻API获取数据');
    
    try {
      // 从环境变量获取API配置
      const apiUrl = process.env.NEWS_API_URL;
      const apiKey = process.env.NEWS_API_KEY;
      
      if (!apiUrl || !apiKey) {
        console.error('缺少新闻API配置，跳过任务');
        return;
      }
      
      // 获取数据
      const newsItems = await dataSourceService.fetchFromNewsAPI(apiUrl, apiKey);
      
      // 处理数据
      if (newsItems.length > 0) {
        await dataSourceService.processNewsItems(newsItems);
      }
    } catch (error) {
      console.error(`新闻API定时任务出错: ${error.message}`);
    }
  });
  
  // 存储任务引用
  scheduledJobs.set('newsApiFetch', job);
}

/**
 * 安排从RSS源获取数据的任务
 */
function scheduleRSSFetch() {
  // 每30分钟执行一次 (*/30 * * * *)
  const job = cron.schedule('*/30 * * * *', async () => {
    console.log('执行定时任务: 从RSS源获取数据');
    
    try {
      // 从环境变量获取RSS源配置
      const rssFeeds = process.env.RSS_FEEDS ? process.env.RSS_FEEDS.split(',') : [];
      
      if (rssFeeds.length === 0) {
        console.error('缺少RSS源配置，跳过任务');
        return;
      }
      
      // 获取并处理每个RSS源的数据
      for (const feedUrl of rssFeeds) {
        const newsItems = await dataSourceService.fetchFromRSS(feedUrl.trim());
        
        if (newsItems.length > 0) {
          await dataSourceService.processNewsItems(newsItems);
        }
      }
    } catch (error) {
      console.error(`RSS定时任务出错: ${error.message}`);
    }
  });
  
  // 存储任务引用
  scheduledJobs.set('rssFetch', job);
}

/**
 * 安排更新热门新闻状态的任务
 */
function scheduleTrendingUpdate() {
  // 每天凌晨2点执行一次 (0 2 * * *)
  const job = cron.schedule('0 2 * * *', async () => {
    console.log('执行定时任务: 更新热门新闻状态');
    
    try {
      await dataSourceService.updateTrendingStatus();
    } catch (error) {
      console.error(`更新热门新闻状态任务出错: ${error.message}`);
    }
  });
  
  // 存储任务引用
  scheduledJobs.set('trendingUpdate', job);
}

/**
 * 停止所有定时任务
 */
function stopAllJobs() {
  console.log('正在停止所有定时任务...');
  
  for (const [name, job] of scheduledJobs.entries()) {
    job.stop();
    console.log(`已停止定时任务: ${name}`);
  }
  
  scheduledJobs.clear();
}

/**
 * 手动触发特定任务
 * @param {string} jobName - 任务名称
 * @returns {Promise<boolean>} - 是否成功
 */
async function triggerJob(jobName) {
  console.log(`手动触发定时任务: ${jobName}`);
  
  try {
    switch (jobName) {
      case 'newsApiFetch':
        const apiUrl = process.env.NEWS_API_URL;
        const apiKey = process.env.NEWS_API_KEY;
        
        if (!apiUrl || !apiKey) {
          throw new Error('缺少新闻API配置');
        }
        
        const newsItems = await dataSourceService.fetchFromNewsAPI(apiUrl, apiKey);
        await dataSourceService.processNewsItems(newsItems);
        break;
        
      case 'rssFetch':
        const rssFeeds = process.env.RSS_FEEDS ? process.env.RSS_FEEDS.split(',') : [];
        
        if (rssFeeds.length === 0) {
          throw new Error('缺少RSS源配置');
        }
        
        for (const feedUrl of rssFeeds) {
          const feedItems = await dataSourceService.fetchFromRSS(feedUrl.trim());
          await dataSourceService.processNewsItems(feedItems);
        }
        break;
        
      case 'trendingUpdate':
        await dataSourceService.updateTrendingStatus();
        break;
        
      default:
        throw new Error(`未知的任务名称: ${jobName}`);
    }
    
    return true;
  } catch (error) {
    console.error(`手动触发任务出错 [${jobName}]: ${error.message}`);
    return false;
  }
}

module.exports = {
  initializeJobs,
  stopAllJobs,
  triggerJob,
  scheduledJobs
};
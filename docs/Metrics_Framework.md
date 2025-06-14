# 产品评估指标框架 (Metrics Framework)

## 1. 指标框架概述
- 本文档定义了用于衡量“全球最新科技资讯”产品成功的关键指标，旨在全面评估用户参与度、功能使用情况和产品价值。

## 2. 北极星指标定义
- **北极星指标**：**深度用户参与时长 (Engaged User Time)**
    - *定义*: 用户在应用内进行有意义互动（如阅读资讯、查看小总结、与可视化交互、保存资讯）的总时长。
    - *选择依据*: 该指标能综合反映用户对产品核心价值（高效获取、深度理解科技资讯）的认可和使用程度，比单纯的DAU/MAU更能体现产品粘性。

## 3. HEART/AARRR 等指标体系详述

### AARRR模型
- **获取 (Acquisition)**
    - 新用户注册数
    - 各渠道来源用户数 (如应用商店、社交媒体、合作伙伴推广)
    - 下载量/网站访问量
- **激活 (Activation)**
    - 完成引导流程的用户比例
    - 首次核心功能（如阅读一篇完整资讯、查看AI小总结）使用率
    - 首次保存资讯的用户比例
- **留存 (Retention)**
    - 次日留存率 (D1 Retention)
    - 7日留存率 (D7 Retention)
    - 30日留存率 (D30 Retention)
    - 用户平均会话时长
    - 功能使用频率（如每日查看小总结次数）
- **推荐 (Referral) (V2.0)**
    - 用户分享次数
    - 通过分享带来的新用户数 (K因子)
    - 用户推荐意愿评分 (NPS - Net Promoter Score)
- **收入 (Revenue) (根据商业模式细化)**
    - 付费用户转化率 (如订阅模式)
    - 平均每用户收入 (ARPU)
    - 广告点击率/转化率 (如广告模式)

### HEART 模型 (侧重用户体验)
- **愉悦度 (Happiness)**
    - 用户满意度评分 (通过应用内调研、反馈收集)
    - 应用商店评分
    - AI小总结质量评分 (用户反馈)
    - 可视化内容清晰度/帮助性评分
- **参与度 (Engagement)**
    - 平均每用户资讯阅读篇数
    - AI小总结阅读率 (查看小总结的用户数 / 查看该资讯的用户数)
    - 结构化信息查看率
    - 可视化内容交互率 (点击、缩放等)
    - 平均会话次数/时长
- **接受度 (Adoption)**
    - 新功能（如AI小总结、可视化）的使用渗透率
    - 不同资讯分类的偏好度
- **留存度 (Retention)**
    - (同AARRR中的留存指标)
- **任务完成度 (Task Success)**
    - 用户成功找到特定资讯的比例 (通过搜索或分类)
    - 保存资讯的成功率
    - 用户反馈的问题解决率

## 4. 功能级评估指标

- **资讯核心功能**
    - **资讯浏览量**: 每条资讯的独立访客数 (UV) 和页面浏览量 (PV)
    - **平均阅读时长**: 用户在单篇资讯页面的平均停留时间
    - **资讯阅读完成度**: 阅读超过80%内容的比例
    - **AI小总结阅读率**: (已在HEART中提及)
    - **AI小总结点赞/点踩率**: 用户对小总结质量的直接反馈
    - **结构化信息点击率**: 用户点击查看标签、实体等信息的比例
    - **可视化内容查看率**: 查看可视化图表的用户比例
    - **可视化内容交互次数**: 用户与可视化图表的平均交互次数
    - **资讯保存量/收藏率**: (已在HEART中提及)
    - **资讯分享率**: (V2.0, 已在AARRR中提及)
- **搜索功能**
    - **搜索次数**
    - **搜索结果点击率**
    - **零结果搜索占比**
- **分类功能**
    - **各分类点击率/浏览量**
- **用户账户**
    - **注册转化率**
    - **登录频率**

## 5. 指标检测计划
- **数据收集工具**: 采用成熟的第三方分析平台 (如 Google Analytics, Mixpanel, Amplitude) 结合自建数据仓库。
- **埋点方案**: 针对核心用户行为和功能交互设计详细的埋点方案，确保数据采集的准确性和全面性。
    - *关键埋点事件*: 应用启动、页面浏览、资讯点击、小总结展现/点击、可视化展现/交互、保存、搜索、分享等。
- **报告频率**: 
    - **每日**: 核心运营指标 (DAU, 新增用户, 核心功能使用率)
    - **每周**: 留存分析, 用户行为趋势分析, 功能模块健康度检查
    - **每月**: 深入的用户画像分析, AARRR/HEART模型回顾, 产品迭代效果评估
- **数据看板**: 搭建实时数据看板，监控核心指标，及时发现异常波动。
- **A/B测试**: 对于重要功能迭代和优化，采用A/B测试进行效果验证，基于数据驱动决策。
- **定期回顾**: 产品团队定期（如每两周或每月）召开数据回顾会议，分析数据，洞察用户行为，指导产品优化方向。
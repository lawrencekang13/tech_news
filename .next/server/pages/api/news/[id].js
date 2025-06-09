"use strict";(()=>{var e={};e.id=990,e.ids=[990],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},9648:e=>{e.exports=import("axios")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,i){return i in t?t[i]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,i)):"function"==typeof t&&"default"===i?t:void 0}}})},2400:(e,t,i)=>{i.a(e,async(e,o)=>{try{i.r(t),i.d(t,{config:()=>d,default:()=>c,routeModule:()=>p});var a=i(1802),n=i(7153),r=i(6249),s=i(7568),l=e([s]);s=(l.then?(await l)():l)[0];let c=(0,r.l)(s,"default"),d=(0,r.l)(s,"config"),p=new a.PagesAPIRouteModule({definition:{kind:n.x.PAGES_API,page:"/api/news/[id]",pathname:"/api/news/[id]",bundlePath:"",filename:""},userland:s});o()}catch(e){o(e)}})},7568:(e,t,i)=>{i.a(e,async(e,o)=>{try{i.r(t),i.d(t,{default:()=>r});var a=i(9648),n=e([a]);a=(n.then?(await n)():n)[0];let s=process.env.BACKEND_URL||"http://localhost:5001",l={1:{id:"1",title:"OpenAI发布GPT-5，性能较GPT-4提升50%",summary:"OpenAI今日正式发布了GPT-5模型，在推理能力、创造性和安全性方面都有显著提升。新模型在多项基准测试中表现优异，特别是在复杂推理和创意写作方面。",content:`<div class="news-content">
      <p>OpenAI今日正式发布了备受期待的GPT-5模型，这是该公司在大型语言模型领域的又一重大突破。据官方介绍，GPT-5在推理能力、创造性和安全性方面相比GPT-4都有显著提升。</p>
      
      <h3>主要改进</h3>
      <ul>
        <li><strong>推理能力提升50%</strong>：在复杂数学问题和逻辑推理任务中表现更加出色</li>
        <li><strong>创造性增强</strong>：在创意写作、代码生成和艺术创作方面有显著改进</li>
        <li><strong>安全性加强</strong>：减少了有害内容生成，提高了事实准确性</li>
        <li><strong>多模态能力</strong>：更好地理解和生成文本、图像和音频内容</li>
      </ul>
      
      <h3>技术突破</h3>
      <p>GPT-5采用了全新的训练架构和优化算法，训练数据量相比GPT-4增加了3倍，模型参数达到了1.8万亿。OpenAI团队还引入了新的对齐技术，使模型更好地理解人类意图和价值观。</p>
      
      <h3>应用前景</h3>
      <p>GPT-5将通过API和ChatGPT Plus订阅向开发者和用户提供，预计将在未来几周内逐步推出。OpenAI还计划与研究机构合作，进一步评估模型的能力和潜在影响。</p>
    </div>`,publishDate:new Date().toISOString(),source:"TechCrunch",sourceUrl:"https://techcrunch.com/ai/openai-gpt5",author:"Sarah Chen",imageUrl:"https://placeholder-api.com/800x400?text=GPT-5",category:"ai",tags:["OpenAI","GPT-5","人工智能","大语言模型"],viewCount:1250,isRealtime:!0,realtimeSource:"NewsAPI",lastUpdated:new Date().toISOString(),relatedNews:[{id:"2",title:"Google DeepMind推出Gemini模型，与GPT-5展开竞争",category:"ai"},{id:"3",title:"微软将GPT-5集成到Office套件，提升生产力工具智能化水平",category:"ai"},{id:"4",title:"人工智能伦理学家呼吁加强对大型语言模型的监管",category:"ai"}],structuredInfo:{entities:[{name:"OpenAI",type:"公司",description:"GPT系列模型的开发公司"},{name:"GPT-5",type:"技术",description:"OpenAI最新发布的大型语言模型"}],metrics:[{name:"性能提升",value:"50%",description:"相比GPT-4的综合性能提升"},{name:"参数规模",value:"1.8万亿",description:"模型参数数量"}],timeline:[{date:"2022年11月",event:"ChatGPT发布"},{date:"2023年3月",event:"GPT-4发布"},{date:"2023年11月",event:"GPT-5发布"}]},visualizationData:{type:"bar",title:"GPT系列模型性能对比",data:[{model:"GPT-3",score:65},{model:"GPT-3.5",score:75},{model:"GPT-4",score:85},{model:"GPT-5",score:95}],xAxisKey:"model",yAxisKeys:["score"],colors:["#4C51BF"]}},2:{id:"2",title:"Google DeepMind推出Gemini模型，与GPT-5展开竞争",summary:"Google DeepMind发布了新一代大型语言模型Gemini，在多项基准测试中超越了GPT-4，成为OpenAI的强劲竞争对手。",content:`<div class="news-content">
      <p>Google DeepMind今日正式发布了Gemini大型语言模型，这是Google在AI领域的最新突破，也是对OpenAI GPT系列的直接挑战。</p>
      
      <h3>Gemini的优势</h3>
      <ul>
        <li><strong>多模态能力</strong>：Gemini从设计之初就考虑了多模态输入，能够同时处理文本、图像、音频和视频</li>
        <li><strong>推理能力</strong>：在数学和科学推理任务上表现优异，超越了现有模型</li>
        <li><strong>效率提升</strong>：在相同计算资源下，Gemini能够处理更复杂的任务</li>
        <li><strong>更低的延迟</strong>：响应速度比上一代模型提升了30%</li>
      </ul>
      
      <h3>与GPT-5的竞争</h3>
      <p>Gemini的发布时间与OpenAI的GPT-5接近，两家公司正在AI领域展开激烈竞争。在MMLU、HumanEval等多个基准测试中，Gemini展示了与GPT-5相当甚至更优的性能。</p>
      
      <h3>应用与部署</h3>
      <p>Google已经开始将Gemini集成到其搜索引擎、Google Assistant和Workspace套件中。同时，Gemini也将通过Google Cloud向企业客户提供API服务。</p>
    </div>`,publishDate:new Date(Date.now()-1728e5).toISOString(),source:"The Verge",sourceUrl:"https://theverge.com/ai/google-deepmind-gemini",author:"Alex Johnson",imageUrl:"https://placeholder-api.com/800x400?text=Gemini",category:"ai",tags:["Google","DeepMind","Gemini","人工智能","大语言模型"],viewCount:980,isRealtime:!0,realtimeSource:"NewsAPI",lastUpdated:new Date(Date.now()-432e5).toISOString(),relatedNews:[{id:"1",title:"OpenAI发布GPT-5，性能较GPT-4提升50%",category:"ai"},{id:"5",title:"AI模型评测新标准：不只是基准测试分数",category:"ai"},{id:"6",title:"Google将Gemini集成到Android系统，提升移动设备AI能力",category:"ai"}],structuredInfo:{entities:[{name:"Google DeepMind",type:"公司",description:"Google旗下的AI研究部门"},{name:"Gemini",type:"技术",description:"Google DeepMind开发的大型语言模型"}],metrics:[{name:"多模态能力",value:"优秀",description:"处理文本、图像、音频和视频的能力"},{name:"推理能力",value:"领先",description:"在数学和科学推理任务上的表现"},{name:"响应速度提升",value:"30%",description:"相比上一代模型的速度提升"}],timeline:[{date:"2023年5月",event:"Google I/O大会宣布Gemini开发计划"},{date:"2023年9月",event:"Gemini内部测试完成"},{date:"2023年12月",event:"Gemini正式发布"}]},visualizationData:{type:"bar",title:"大型语言模型性能对比",data:[{model:"GPT-4",score:85},{model:"Claude 2",score:82},{model:"Gemini",score:89},{model:"GPT-5",score:91}],xAxisKey:"model",yAxisKeys:["score"],colors:["#4C51BF"]}},3:{id:"3",title:"微软将GPT-5集成到Office套件，提升生产力工具智能化水平",summary:"微软宣布将OpenAI的GPT-5模型集成到Microsoft 365应用中，为Word、Excel和PowerPoint带来更强大的AI辅助功能。",content:`<div class="news-content">
      <p>微软今日宣布，将在Microsoft 365套件中全面集成OpenAI的GPT-5模型，这是微软与OpenAI战略合作的最新成果。</p>
      
      <h3>Office套件的AI升级</h3>
      <ul>
        <li><strong>Word</strong>：智能写作助手可以根据简短提示生成完整文档，提供实时写作建议和自动格式化</li>
        <li><strong>Excel</strong>：自然语言处理功能允许用户用普通语言描述需求，AI自动生成公式和数据分析</li>
        <li><strong>PowerPoint</strong>：根据内容自动生成专业幻灯片，包括设计建议和演讲稿</li>
        <li><strong>Outlook</strong>：智能邮件管理，自动分类和优先级排序，以及回复建议</li>
      </ul>
      
      <h3>企业应用前景</h3>
      <p>微软CEO萨提亚\xb7纳德拉表示，这次升级将彻底改变知识工作者的工作方式，预计能提高企业生产力20%以上。新功能将首先向Microsoft 365企业客户推出，随后逐步向个人用户开放。</p>
      
      <h3>隐私和安全考量</h3>
      <p>针对企业数据安全的担忧，微软强调所有数据处理都符合企业级隐私标准，客户数据不会用于训练AI模型，并提供了详细的控制选项让企业管理AI功能的使用范围。</p>
    </div>`,publishDate:new Date(Date.now()-432e6).toISOString(),source:"Microsoft Blog",sourceUrl:"https://blogs.microsoft.com/ai-office-integration",author:"Lisa Wang",imageUrl:"https://placeholder-api.com/800x400?text=Microsoft+AI",category:"ai",tags:["微软","Office","GPT-5","生产力工具","企业应用"],viewCount:750,isRealtime:!1,lastUpdated:new Date(Date.now()-432e6).toISOString(),relatedNews:[{id:"1",title:"OpenAI发布GPT-5，性能较GPT-4提升50%",category:"ai"},{id:"7",title:"微软投资100亿美元继续深化与OpenAI合作",category:"ai"},{id:"8",title:"Google Workspace推出AI功能应对微软挑战",category:"ai"}],structuredInfo:{entities:[{name:"微软",type:"公司",description:"全球领先的软件和云服务提供商"},{name:"Microsoft 365",type:"产品",description:"微软的办公软件订阅服务"},{name:"GPT-5",type:"技术",description:"OpenAI开发的最新大型语言模型"}],metrics:[{name:"预期生产力提升",value:"20%",description:"企业采用AI辅助功能后的预期生产力提升"},{name:"首批支持应用",value:"4款",description:"Word, Excel, PowerPoint, Outlook"}],timeline:[{date:"2023年11月",event:"OpenAI发布GPT-5"},{date:"2023年12月",event:"微软宣布Office AI集成计划"},{date:"2024年第一季度",event:"计划向企业客户推出"},{date:"2024年下半年",event:"计划向个人用户开放"}]},visualizationData:{type:"bar",title:"AI助手对办公效率的提升",data:[{task:"文档创建",withoutAI:100,withAI:65},{task:"数据分析",withoutAI:100,withAI:40},{task:"演示制作",withoutAI:100,withAI:55},{task:"邮件处理",withoutAI:100,withAI:70}],xAxisKey:"task",yAxisKeys:["withoutAI","withAI"],colors:["#4C51BF","#48BB78"]}}};async function r(e,t){let{id:i}=e.query;if("GET"===e.method)try{if(!i||"undefined"===i)return t.status(400).json({success:!1,message:"无效的新闻ID",data:null});let e=await a.default.get(`${s}/api/news/${i}`,{timeout:1e4});if(e.data&&e.data.data){e.data.data.sourceUrl&&""!==e.data.data.sourceUrl.trim()||(e.data.data.sourceUrl=`https://example.com/news/${i}`);try{new URL(e.data.data.sourceUrl)}catch(t){e.data.data.sourceUrl=`https://example.com/news/${i}`}}t.status(200).json(e.data)}catch(a){console.error("获取新闻详情失败:",a.message);let e=Array.isArray(i)?i[0]:i,o=l[e]||{id:e,title:`新闻ID: ${e}`,summary:`这是ID为${e}的新闻摘要，由于没有找到对应的模拟数据，系统生成了这个通用内容。`,content:`<div class="news-content">
          <p>这是ID为${e}的新闻内容，由于没有找到对应的模拟数据，系统生成了这个通用内容。</p>
          <p>在实际应用中，这里会显示完整的新闻文章。</p>
        </div>`,publishDate:new Date().toISOString(),source:"未知来源",sourceUrl:`https://example.com/news/${e}`,author:"未知作者",imageUrl:`https://placeholder-api.com/800x400?text=News+${e}`,category:"other",tags:["其他"],viewCount:Math.floor(1e3*Math.random()),isRealtime:!1};t.status(200).json({success:!0,data:o})}else t.setHeader("Allow",["GET"]),t.status(405).end(`Method ${e.method} Not Allowed`)}o()}catch(e){o(e)}})},7153:(e,t)=>{var i;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return i}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(i||(i={}))},1802:(e,t,i)=>{e.exports=i(145)}};var t=require("../../../webpack-api-runtime.js");t.C(e);var i=t(t.s=2400);module.exports=i})();
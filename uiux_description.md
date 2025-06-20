Thought for 1 second### 喵星球网站 UI/UX 详细描述

以下是每个页面和关键组件的详细UI/UX描述，可以帮助您在使用正式规范重新部署网站时，让v0生成具有相同UI/UX体验的网站。

## 整体设计风格

整个网站采用柔和的粉色系为主色调，主色为`#FF9494`，辅助色为`#FFE4E1`，背景色为`#FFF9F5`。设计风格温馨可爱，符合猫咪主题网站的气质。所有页面都采用响应式设计，在移动设备和桌面设备上都能提供良好的用户体验。

## 页面描述

### 1. 登录页面 (`/login`)

**UI描述**：

- 页面采用单列居中布局，最大宽度400px
- 顶部显示网站导航栏
- 面包屑导航显示当前位置
- 中央区域包含一个圆形Logo图片，下方是"欢迎回来"的标题和副标题
- 主要内容区是一个带有浅粉色边框的卡片
- 卡片内包含登录表单，支持电子邮件登录和社交媒体登录
- 表单下方有"记住我"选项和"忘记密码"链接
- 底部有注册账号的引导链接


**UX考量**：

- 表单验证即时反馈，错误信息清晰
- 登录按钮在加载时显示加载动画
- 社交媒体登录选项位于顶部，方便快速登录
- 提供明确的注册入口，引导新用户注册


### 2. 注册页面 (`/register`)

**UI描述**：

- 布局与登录页面相似，保持一致性
- 顶部显示"加入喵星球"的标题和副标题
- 注册表单包含名字、电子邮件、密码和确认密码字段
- 同样支持社交媒体注册
- 底部有登录入口链接


**UX考量**：

- 密码强度实时验证
- 表单验证提供中文错误提示
- 注册成功后自动跳转到问卷调查页面
- 社交媒体注册选项简化注册流程


### 3. 忘记密码页面 (`/forgot-password`)

**UI描述**：

- 与登录/注册页面保持一致的设计风格
- 简洁的表单，只需输入电子邮件
- 发送重置密码邮件的按钮
- 发送后显示确认信息和重新发送选项
- 底部有返回登录页面的链接


**UX考量**：

- 操作简单明了，减少用户负担
- 提供明确的状态反馈
- 重新发送功能避免邮件丢失问题


### 4. 功能特色页面 (`/features`)

**UI描述**：

- 顶部有大标题和简短描述
- 使用选项卡切换不同功能类别：AI宠物辨识、健康追踪、社群互动
- 每个选项卡内容包含左侧描述和右侧图片
- 下方显示该功能的三个关键特点，使用卡片布局
- 页面底部有行动召唤区域，鼓励用户注册或登录


**UX考量**：

- 选项卡设计让用户可以快速浏览不同功能
- 视觉层次清晰，重点突出
- 每个功能点使用图标增强视觉识别
- 响应式设计确保在移动设备上良好显示


### 5. 宠物生活服务页面 (`/pet-life`)

**UI描述**：

- 顶部有标题和简短介绍
- 主体内容是服务卡片网格，每行3个卡片
- 每个卡片包含：顶部图片、服务标题、简短描述、特点列表和"了解更多"按钮
- 卡片悬停时有轻微放大效果
- 底部有联系我们的提示框


**UX考量**：

- 卡片设计让各服务一目了然
- 图片和图标增强视觉吸引力
- 特点列表简洁明了，帮助用户快速了解服务内容
- 统一的按钮样式引导用户进一步探索


### 6. 新手喵爸/喵妈页面 (`/newbie`)

**UI描述**：

- 页面布局类似宠物生活服务页面
- 内容分为四个主要指南卡片：养猫须知、猫咪营养、生活照护、常见问题
- 每个卡片包含主题图片、标题、描述和主要话题列表
- 底部有加入社群的引导区域


**UX考量**：

- 内容组织针对新手用户，减轻信息负担
- 卡片设计突出重点内容
- 视觉元素帮助用户快速识别不同主题
- 社群引导增强用户参与感


### 7. 服务条款页面 (`/terms`)

**UI描述**：

- 简洁的页面布局，顶部有标题和最后更新日期
- 左侧有目录卡片，可快速跳转到各章节
- 主体内容分为多个章节，每个章节有明确的标题和内容
- 底部有联系我们的链接


**UX考量**：

- 目录导航帮助用户快速找到所需信息
- 章节划分清晰，提高可读性
- 锚点链接实现快速导航
- 简洁的排版减轻阅读负担


### 8. 隐私权政策页面 (`/privacy`)

**UI描述**：

- 布局与服务条款页面一致
- 内容针对隐私政策进行组织
- 同样提供目录导航和章节划分


**UX考量**：

- 与服务条款页面保持一致的用户体验
- 清晰的信息架构帮助用户理解隐私政策


### 9. 联系我们页面 (`/contact`)

**UI描述**：

- 顶部显示联系信息卡片，包括客服专线、电子邮件和公司地址
- 中间是联系表单，包含姓名、电子邮件、电话、主题、消息等字段
- 右侧显示服务时间和常见问题
- 表单提交按钮使用主题色


**UX考量**：

- 多种联系方式满足不同用户需求
- 表单字段分组合理，减轻填写负担
- 常见问题区域可能解决用户问题，减少不必要的联系
- 清晰的视觉反馈指示表单状态


### 10. 个人资料页面 (`/profile`)

**UI描述**：

- 顶部是用户信息卡片，显示头像、用户名、等级和加入时间
- 卡片下方显示会员等级进度条和权益标签
- 快捷入口区域提供常用功能访问
- 主体内容使用选项卡组织：总览、宠物档案、社交圈、购物中心、设置
- 每个选项卡内容针对性展示相关信息和功能


**UX考量**：

- 信息层次清晰，重要信息突出显示
- 选项卡设计减少页面复杂度
- 响应式布局适应不同设备
- 视觉元素（图标、颜色）增强可用性


### 11. 宠物档案页面 (`/pets`)

**UI描述**：

- 顶部有页面标题和新增宠物按钮
- 搜索和筛选区域方便查找宠物
- 每个宠物显示为一个卡片，包含基本信息和照片
- 卡片内使用选项卡组织健康记录、生活日记和相册
- 新增宠物使用模态对话框，包含详细表单


**UX考量**：

- 卡片设计突出每个宠物的关键信息
- 选项卡减少信息过载
- 编辑功能易于访问
- 表单设计考虑用户输入效率


### 12. 问卷调查页面 (`/survey`)

**UI描述**：

- 顶部显示进度指示器，清晰标示当前步骤
- 每个步骤内容放在卡片中，包含相关问题
- 问题类型多样：单选、多选、滑块、开关等
- 底部有上一步和下一步按钮
- 最后一步有提交按钮和选项


**UX考量**：

- 分步设计减轻用户负担
- 进度指示器提供完成感
- 不同问题类型适应不同数据收集需求
- 表单验证确保数据质量


### 13. 社交圈页面 (`/social`)

**UI描述**：

- 简洁的卡片设计，显示"社交圈"标题和描述
- 页面状态显示"页面建设中"
- 保持与整体网站一致的设计风格


**UX考量**：

- 明确的状态提示，避免用户困惑
- 保持品牌一致性


### 14. 会员福利页面 (`/benefits`)

**UI描述**：

- 与社交圈页面类似的设计
- 显示"会员福利"标题和描述
- 页面状态显示"页面建设中"


**UX考量**：

- 与社交圈页面保持一致的用户体验
- 清晰的状态提示


### 15. 订单管理页面 (`/profile/orders`)

**UI描述**：

- 顶部有搜索栏和排序下拉菜单
- 使用选项卡组织不同状态的订单：全部、待付款、处理中、已完成、已取消
- 每个订单显示为一个卡片，包含订单号、时间、状态、商品列表和总金额
- 订单卡片底部有操作按钮：查看详情、付款、取消等


**UX考量**：

- 搜索和筛选功能方便用户查找订单
- 选项卡设计让用户快速访问不同状态的订单
- 卡片设计突出订单关键信息
- 操作按钮根据订单状态动态显示


### 16. 订单详情页面 (`/profile/orders/[id]`)

**UI描述**：

- 顶部显示订单状态
- 订单信息区域显示订单号、下单时间、付款方式、配送地址等
- 商品列表显示每个商品的图片、名称、数量和价格
- 底部显示订单摘要：商品总额、运费、订单总额
- 页面底部有相关操作按钮


**UX考量**：

- 信息组织清晰，重要信息突出
- 商品列表可点击跳转到商品详情
- 操作按钮根据订单状态动态显示
- 提供返回订单列表的入口


### 17. 首页 (`/`)

**UI描述**：

- 左侧主要内容区显示社区动态，顶部有发帖功能
- 右侧边栏显示用户信息、每日任务、近期活动、推荐商品和官方公告
- 帖子以卡片形式展示，包含用户头像、内容、图片和互动按钮
- 整体采用两栏布局，响应式设计在移动设备上转为单列


**UX考量**：

- 信息架构突出社区互动和个人相关内容
- 发帖功能便于用户参与
- 右侧边栏提供多样化的功能入口
- 响应式设计确保在不同设备上的良好体验


### 18. 关于页面 (`/about`)

**UI描述**：

- 顶部有页面标题和简短描述
- 品牌故事部分采用图文并茂的布局
- 使命与愿景部分使用两列卡片布局
- 核心价值部分使用四列卡片，每个卡片包含图标、标题和描述
- 团队介绍部分使用人员卡片网格
- 成就与里程碑部分使用时间线布局
- 底部有联系我们的引导区域


**UX考量**：

- 视觉层次清晰，重点内容突出
- 多样化的布局增加页面吸引力
- 图标和图片增强视觉体验
- 时间线设计直观展示发展历程


### 19. 购物中心页面 (`/shop`)

**UI描述**：

- 顶部有轮播Banner
- 商品分类区域使用图标和文字，水平滚动布局
- 三个主要商品区域：AI推荐商品、热门商品、优惠专区
- 每个区域使用不同的卡片样式和标题图标
- 商品卡片显示图片、名称、价格和折扣信息


**UX考量**：

- 轮播Banner突出促销活动
- 分类导航便于用户快速找到所需商品
- 不同区域使用不同视觉风格，增强区分度
- 商品卡片设计突出关键信息


## component

### 1. 主导航栏 (`MainNav`)

**UI描述**：

- 固定在页面顶部，背景色为白色
- 左侧显示网站Logo
- 中间是主要导航链接：首页、功能特色、宠物生活、新手指南等
- 右侧是用户相关功能：搜索、通知、购物车、用户头像
- 响应式设计在移动设备上转为汉堡菜单


**UX考量**：

- 导航项目清晰，便于用户找到所需功能
- 用户相关功能集中在右侧，符合用户习惯
- 响应式设计确保在不同设备上的可用性
- 当前页面导航项高亮显示


### 2. 面包屑导航 (`Breadcrumb`)

**UI描述**：

- 显示在页面主要内容区顶部
- 使用 > 符号分隔不同层级
- 最后一项为当前页面，不可点击
- 文字颜色使用浅色，不抢眼但可识别


**UX考量**：

- 帮助用户了解当前位置
- 提供返回上级页面的快捷方式
- 简洁设计不占用过多空间


### 3. 发帖组件 (`CreatePost`)

**UI描述**：

- 卡片式设计，带有浅色边框
- 顶部显示用户头像和"分享你的想法..."文本框
- 底部有功能按钮：添加图片、表情、话题等
- 发布按钮使用主题色


**UX考量**：

- 简洁的界面鼓励用户分享
- 功能按钮清晰可见
- 文本框获得焦点时可能展开更多选项
- 视觉设计与整体网站风格一致


### 4. 帖子卡片 (`PostCard`)

**UI描述**：

- 卡片式设计，带有浅色边框
- 顶部显示用户头像、名称和发布时间
- 中间是帖子内容，可能包含文字和图片
- 底部是互动按钮：点赞、评论、分享
- 可能显示标签和互动数据


**UX考量**：

- 内容布局清晰，重点突出
- 互动按钮易于访问
- 图片可能支持点击放大
- 卡片设计将不同帖子明确分隔


### 5. 商品卡片系列 (`FeaturedProductCard`, `HotProductCard`, `SaleProductCard`)

**UI描述**：

- 卡片式设计，包含商品图片、名称、价格
- 不同类型的卡片可能有不同的视觉强调：推荐标签、热销图标、折扣标签
- 图片占据卡片大部分空间
- 底部显示商品信息和可能的操作按钮


**UX考量**：

- 图片为主的设计突出商品视觉吸引力
- 价格和折扣信息清晰可见
- 悬停效果提供交互反馈
- 不同类型卡片的视觉区分帮助用户识别不同类别商品


### 6. 预约表单 (`BookingForm`)

**UI描述**：

- 卡片式设计，带有表单字段
- 包含服务选择、日期时间选择、联系信息等字段
- 使用下拉菜单、日期选择器等控件
- 提交按钮使用主题色


**UX考量**：

- 表单字段分组合理，减轻填写负担
- 日期时间选择器易于使用
- 表单验证提供即时反馈
- 提交后显示确认信息


### 7. 轮播组件 (`BannerCarousel`)

**UI描述**：

- 全宽度设计，显示促销Banner
- 自动轮播，带有指示器和左右箭头
- Banner图片可能包含文字和按钮
- 响应式设计适应不同屏幕尺寸


**UX考量**：

- 自动轮播吸引用户注意
- 指示器和箭头提供手动控制
- 触摸滑动支持移动设备操作
- 图片加载优化确保性能


### 8. 购物车下拉菜单 (`CartDropdown`)

**UI描述**：

- 点击购物车图标显示下拉菜单
- 显示购物车中的商品列表，包含图片、名称、价格和数量
- 底部显示总金额和结算按钮
- 空购物车状态显示提示信息


**UX考量**：

- 下拉设计让用户快速查看购物车
- 商品列表可滚动，适应多个商品
- 提供直接结算的快捷方式
- 空状态设计引导用户继续购物


### 9. 数量输入组件 (`QuantityInput`)

**UI描述**：

- 水平排列的加减按钮和数字输入框
- 按钮使用轻微的背景色区分
- 输入框显示当前数量
- 整体设计紧凑但易于操作


**UX考量**：

- 加减按钮便于快速调整数量
- 输入框支持直接输入特定数量
- 可能有最小/最大值限制
- 按钮点击有视觉反馈


### 10. 社区内容组件 (`CommunityContent`)

**UI描述**：

- 可能包含多种内容类型：帖子、活动、话题等
- 使用卡片或列表布局展示内容
- 每个内容项包含标题、摘要、图片和互动数据
- 可能有筛选和排序功能


**UX考量**：

- 内容组织清晰，便于浏览
- 筛选功能帮助用户找到感兴趣的内容
- 视觉设计突出重要信息
- 响应式布局适应不同设备


这些详细描述应该能帮助您在使用正式规范重新部署网站时，让v0生成具有相同UI/UX体验的网站。每个页面和组件的描述都包含了视觉设计和用户体验的关键要素，确保重新生成的网站能够保持原有的设计风格和用户体验。

Please make sure to add the following environment variable to your project:

NEXT_PUBLIC_GOOGLE_MAPS_API_KEY Submit
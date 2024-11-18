import mongoose from 'mongoose';
import { Article } from '~/models/Article/articleSchema.js';
import { Tag } from '~/models/Tag/tagSchema.js';
import { Section } from '~/models/Section/sectionSchema.js';
import { Account } from '~/models/Account/accountSchema.js';
import { ReporterProfile } from '~/models/Profile/reporterProfile.js';
import { EditorProfile } from '~/models/Profile/editorProfile.js';
import bcrypt from 'bcrypt';

// Hàm tạo slug từ tiêu đề
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/ /g, '-') // Thay khoảng trắng bằng dấu gạch ngang
    .replace(/[^\w-]+/g, ''); // Loại bỏ ký tự đặc biệt
};

export const seedArticlesWithReporterAndEditor = async () => {
  try {
    // Xóa dữ liệu cũ
    await Article.deleteMany({});
    console.log('Old articles cleared.');

    // Tạo tài khoản và profile cho Reporter
    const reporterAccount = new Account({
      email: 'reporter@example.com',
      role: 'reporter',
      profileType: 'ReporterProfile',
      localAuth: {
        username: 'reporterAccount',
        password: await bcrypt.hash('123', 10) // Mật khẩu mặc định "123"
      }
    });
    await reporterAccount.save();

    const reporterProfile = new ReporterProfile({
      accountId: reporterAccount._id,
      name: 'John Doe',
      dob: new Date('1990-01-01'),
      gender: 'male',
      reportArticles: []
    });
    await reporterProfile.save();

    // Cập nhật profileId trong account
    reporterAccount.profileId = reporterProfile._id as mongoose.Types.ObjectId;
    await reporterAccount.save();

    const reporterAccount2 = new Account({
      email: 'davidremnick@example.com',
      role: 'reporter',
      profileType: 'ReporterProfile',
      localAuth: {
        username: 'davidremnick',
        password: await bcrypt.hash('davidremnickpassword', 10) // Mật khẩu mặc định "123"
      }
    });
    await reporterAccount2.save();

    const reporterProfile2 = new ReporterProfile({
      accountId: reporterAccount2._id,
      name: 'David Remnick',
      dob: new Date('1958-10-29'),
      gender: 'male',
      reportArticles: []
    });
    await reporterProfile2.save();

    reporterAccount2.profileId = reporterProfile2._id as mongoose.Types.ObjectId;
    await reporterAccount2.save();

    console.log('Reporter account and profile created.');

    // Lấy ObjectId cho các trường liên quan
    const sections = await Section.find();
    const tags = await Tag.find();
    const editors = await EditorProfile.find(); // Lấy tất cả editors

    const getSectionId = (name: string) => sections.find((section) => section.name === name)?._id;

    const getTagIds = (tagNames: string[]) => tags.filter((tag) => tagNames.includes(tag.name)).map((tag) => tag._id);

    const getEditorForSection = (sectionId: mongoose.Types.ObjectId | undefined) => editors.find((editor) => editor.sectionId?.toString() === sectionId?.toString())?._id; // Tìm editor thuộc section

    // Lấy ngày hiện tại
    const today = new Date();

    // Dữ liệu bài viết
    const articleData = [
      {
        title: 'How Donald Trump Gave Democrats the Working-Class Blues',
        content: '...Content...',
        description: '...Description...',
        images: ['...URL...'],
        sectionId: getSectionId('Politics'),
        tags: getTagIds(['Breaking News', 'Politics']),
        author: reporterProfile._id, // Gán author là ReporterProfile vừa tạo
        editor: getEditorForSection(getSectionId('Politics')), // Gắn editor dựa trên section
        slug: generateSlug('How Donald Trump Gave Democrats the Working-Class Blues'), // Thêm slug
        status: 'published',
        publishedAt: today
      },
      {
        title: 'The Naïveté Behind Post-Election Despair',
        content: '...Content...',
        description: '...Description...',
        images: ['...URL...'],
        sectionId: getSectionId('Politics'),
        tags: getTagIds(['Politics']),
        author: reporterProfile._id,
        editor: getEditorForSection(getSectionId('Politics')),
        slug: generateSlug('The Naïveté Behind Post-Election Despair'), // Thêm slug
        status: 'published',
        publishedAt: today
      },
      {
        title: 'Documentaries of Dissent',
        content: '...Content...',
        description: '...Description...',
        images: ['...URL...'],
        sectionId: getSectionId('Arts'),
        tags: getTagIds(['Reviews', 'Art']),
        author: reporterProfile._id,
        editor: getEditorForSection(getSectionId('Arts')),
        slug: generateSlug('Documentaries of Dissent'), // Thêm slug
        status: 'published',
        publishedAt: today
      },
      {
        title: 'The Cleveland Cavaliers Are Dialed In',
        content: 'The Cleveland Cavaliers are showing extraordinary form this season...',
        description: '...Description...',
        images: ['https://media.newyorker.com/photos/672e855f55c32282ba45df79/master/w_2240,c_limit/Thomas-Cleveland-Cavaliers.jpg'],
        sectionId: getSectionId('Sports'),
        tags: getTagIds(['Basketball', 'Sports']),
        author: reporterProfile._id,
        editor: getEditorForSection(getSectionId('Sports')),
        slug: generateSlug('The Cleveland Cavaliers Are Dialed In'), // Thêm slug
        status: 'published',
        publishedAt: today
      },
      {
        title: 'The Rise of Global Populism',
        description: 'Examining the causes and consequences of the growing populist movements worldwide.',
        content:
          'In recent years, populist movements have surged around the globe, challenging established political norms and questioning the direction of democracies. These movements, often led by charismatic leaders, tend to rally against political elites, globalization, and the perceived failures of traditional institutions. Populism is not a new phenomenon; however, its rise in the 21st century has sparked intense debates regarding its long-term consequences on global governance and individual freedoms. One of the key drivers behind this rise is economic inequality. In many nations, the gap between the rich and poor has widened, leaving large segments of the population feeling disillusioned with the political establishment. Populist leaders are adept at exploiting this frustration, offering simple solutions to complex problems. Whether it’s blaming immigrants for economic hardship or attacking the media for undermining national unity, populism thrives on dividing society into ‘us vs. them’. Additionally, the rapid advancement of technology and social media platforms has provided populist movements with a powerful tool for reaching a global audience. The spread of misinformation, the use of targeted political ads, and the echo chambers created on platforms like Facebook and Twitter have enabled populist messages to gain traction at an unprecedented rate. These platforms allow political figures to bypass traditional media channels, directly addressing their supporters and mobilizing them for political action. However, the rise of populism is not without its risks. While populist leaders often promise to return power to the people, their actions frequently undermine democratic institutions and norms. From eroding checks and balances to restricting press freedom, populist governments have demonstrated a troubling tendency to consolidate power and weaken the rule of law. Internationally, the rise of populism has strained relations between countries and further complicated efforts to address global challenges, such as climate change, economic inequality, and security threats. The backlash against globalization, which many populist leaders advocate for, has disrupted trade relations and led to the withdrawal from international agreements, such as the Paris Climate Accord. This isolationist approach may limit cooperation on issues that require a unified global response. The implications of this global shift towards populism are far-reaching. While some see it as a necessary corrective to a broken political system, others view it as a dangerous trend that could erode the principles of democracy and human rights. As populist movements continue to gain momentum, the world faces a critical juncture in determining whether these movements will lead to a reformation of politics or a dismantling of democratic norms.',
        images: ['https://images.unsplash.com/photo-1506748686219-f65b8d9e5f2f'],
        sectionId: getSectionId('Politics'),
        tags: getTagIds(['Politics', 'Breaking News']),
        author: reporterProfile2._id,
        editor: getEditorForSection(getSectionId('Politics')),
        slug: generateSlug('The Rise of Global Populism'),
        status: 'published',
        publishedAt: today
      },
      {
        title: 'The Future of Electric Cars',
        description: 'Exploring the advancements and challenges in the electric vehicle industry.',
        content:
          'The electric vehicle (EV) revolution is gaining momentum, with governments, businesses, and consumers increasingly recognizing the need to transition away from fossil fuels. The environmental benefits of EVs are undeniable, with zero tailpipe emissions helping to reduce air pollution and mitigate climate change. As the world grapples with the urgency of addressing environmental concerns, EVs are seen as a critical part of the solution. However, despite their promise, electric vehicles still face numerous challenges before they can become the dominant mode of transportation. One of the most significant barriers to widespread adoption is the cost. While prices have come down in recent years, EVs are still generally more expensive than their gasoline counterparts. The cost of the batteries, which make up a significant portion of the vehicle’s price, remains high. Though advancements in battery technology are expected to lower costs over time, the upfront expense continues to deter many consumers from making the switch to electric. Another challenge is the availability of charging infrastructure. While urban areas may have sufficient charging stations, rural areas and long-distance travel routes often lack the infrastructure necessary to support EVs. This so-called ‘range anxiety’ is a common concern for potential buyers, who worry about being stranded without a nearby charging station. In addition to these practical concerns, there are environmental issues related to the production and disposal of EV batteries. While electric vehicles produce fewer emissions over their lifetime, the mining and processing of raw materials for batteries, such as lithium, cobalt, and nickel, can have significant environmental and human rights impacts. Moreover, the recycling of EV batteries remains a complicated and expensive process, with the potential for toxic waste if not managed properly. Despite these hurdles, the electric vehicle market continues to grow. Major automakers have committed to transitioning their fleets to electric, and new players, such as Tesla, have disrupted the industry with innovative designs and cutting-edge technology. Governments are also playing a significant role in this transformation, offering incentives, subsidies, and rebates to encourage EV adoption. Furthermore, advancements in battery technology and renewable energy sources are likely to make electric vehicles more affordable and efficient in the coming years. In the future, electric vehicles may not only be the norm but could also become a central component of smart cities, integrated with renewable energy grids and autonomous driving technology. The road to a fully electric future may be long and challenging, but the benefits of EVs—both environmental and economic—are too significant to ignore. As the global shift toward sustainable transportation accelerates, electric vehicles will undoubtedly play a key role in shaping the future of mobility.',
        images: ['https://images.unsplash.com/photo-1581094927220-4c4faecde729'],
        sectionId: getSectionId('Technology'),
        tags: getTagIds(['Technology', 'Environment']),
        author: reporterProfile2._id,
        editor: getEditorForSection(getSectionId('Technology')),
        slug: generateSlug('The Future of Electric Cars'),
        status: 'published',
        publishedAt: today
      },
      {
        title: 'Artificial Intelligence and the Future of Work',
        description: 'How AI is transforming industries and changing the job landscape.',
        content:
          'Artificial intelligence (AI) is no longer a futuristic concept but a present-day reality reshaping industries across the globe. From manufacturing and logistics to healthcare and finance, AI-powered systems are increasing efficiency, reducing costs, and improving accuracy in a variety of sectors. Machine learning algorithms, natural language processing, and robotics are enabling businesses to automate routine tasks, analyze vast amounts of data, and make more informed decisions. However, the rise of AI also raises significant questions about the future of work. As machines take on more complex tasks, there is growing concern about job displacement and the erosion of traditional roles. In some sectors, automation is already replacing human workers, particularly in industries like manufacturing, where robots can perform repetitive tasks more quickly and accurately than humans. While automation can drive down costs and improve productivity, it also leaves many workers without the skills needed to compete in an increasingly tech-driven economy. This challenge is not just about job losses but also about creating new opportunities for workers. AI has the potential to create new industries and job roles, but these opportunities require workers to possess new skill sets. As AI evolves, the demand for workers with expertise in data science, machine learning, and AI programming will rise. To prepare the workforce for these shifts, there is a growing need for education and training programs that equip people with the skills necessary to thrive in an AI-driven economy. The impact of AI on work is also being felt in creative industries. While AI can assist in tasks like editing, data analysis, and content generation, it also raises questions about creativity and human intuition. Many worry that AI will take over jobs traditionally seen as requiring human creativity, such as journalism, graphic design, and even art. Yet, others argue that AI can enhance human creativity, providing new tools for innovation rather than replacing human workers altogether. Ultimately, the future of AI in the workplace will depend on how it is integrated into society. Policymakers, business leaders, and educators will need to collaborate to ensure that the benefits of AI are distributed equitably and that workers are adequately supported through the transition to an AI-driven economy. While there are many uncertainties about the future of work in the age of AI, one thing is clear: AI will be a central force in shaping the labor market of tomorrow.',
        images: ['https://images.unsplash.com/photo-1589222147998-bf89735c4ad9'],
        sectionId: getSectionId('Technology'),
        tags: getTagIds(['Technology', 'Economy']),
        author: reporterProfile2._id,
        editor: getEditorForSection(getSectionId('Technology')),
        slug: generateSlug('Artificial Intelligence and the Future of Work'),
        status: 'published',
        publishedAt: today
      },
      {
        title: 'Climate Change and Its Impact on Global Ecosystems',
        description: 'A deep dive into how climate change is threatening biodiversity and ecosystems worldwide.',
        content:
          'Climate change is arguably one of the most pressing challenges facing the global community today. Rising temperatures, more extreme weather events, and sea-level rise are just some of the consequences that are already being felt by ecosystems around the world. These environmental shifts are having a profound impact on biodiversity, with numerous species being pushed to the brink of extinction as their habitats become inhospitable. Forests, oceans, and wetlands, all vital to maintaining balance in the natural world, are experiencing unprecedented levels of stress. As the planet continues to warm, many species are struggling to adapt to the changing conditions, and conservationists are racing against the clock to protect the most vulnerable ecosystems. One of the most visible effects of climate change on ecosystems is the loss of biodiversity. As temperatures rise, species that are adapted to specific environmental conditions are unable to survive in new climates. For example, polar bears are losing their ice-covered habitats as Arctic ice melts, while coral reefs, which are highly sensitive to temperature changes, are experiencing widespread bleaching events. These shifts in ecosystems not only threaten the survival of individual species but also disrupt entire food chains. In addition to biodiversity loss, climate change is intensifying weather patterns, leading to more frequent and severe natural disasters. Wildfires, floods, hurricanes, and droughts are becoming more common, and these extreme events take a significant toll on both wildlife and human populations. The devastation caused by these disasters further compounds the challenges faced by ecosystems already weakened by climate change. The health of our oceans is also at risk. Ocean acidification, caused by increased CO2 emissions, is threatening marine life, particularly coral reefs and shellfish. These ecosystems are not only home to diverse marine species but also play a critical role in regulating the Earth’s climate by absorbing carbon dioxide. The loss of these ecosystems would have devastating consequences for both marine biodiversity and the planet’s ability to combat climate change. It is clear that the fight against climate change is urgent, and addressing the challenges it poses to ecosystems will require coordinated global action. Governments, businesses, and individuals must work together to reduce greenhouse gas emissions, protect vital ecosystems, and invest in conservation efforts. The consequences of inaction are too great to ignore, and it is imperative that we take steps to mitigate the effects of climate change on our planet’s biodiversity.',
        images: ['https://images.unsplash.com/photo-1597746480087-fc2db45be6c0'],
        sectionId: getSectionId('Environment'),
        tags: getTagIds(['Environment', 'Climate Change']),
        author: reporterProfile2._id,
        editor: getEditorForSection(getSectionId('Environment')),
        slug: generateSlug('Climate Change and Its Impact on Global Ecosystems'),
        status: 'published',
        publishedAt: today
      },
      {
        title: 'The Ethics of Genetic Engineering',
        description: 'A look at the moral questions surrounding gene editing technologies like CRISPR.',
        content:
          'Genetic engineering has advanced significantly in recent years, with technologies like CRISPR offering the ability to edit genes with unprecedented precision. These advancements have the potential to cure genetic diseases, improve agricultural productivity, and even extend human lifespan. However, they also raise a host of ethical concerns. One of the most controversial aspects of genetic engineering is the possibility of editing human embryos. While gene editing could prevent the transmission of inherited diseases, it also opens the door to “designer babies” – genetically modified children with selected traits, such as intelligence or physical appearance. Critics argue that this could lead to a society where genetic enhancement is available only to the wealthy, exacerbating inequality and potentially leading to social division. Additionally, the long-term consequences of gene editing on the human gene pool are still unknown. There is a risk that changes made to one generation could have unintended effects on future generations. Another ethical concern is the use of genetic engineering in agriculture. While genetically modified crops have the potential to increase food production and combat hunger, they also raise questions about environmental sustainability and the potential for unintended ecological consequences. Critics argue that genetically modified organisms (GMOs) could disrupt ecosystems and lead to the loss of biodiversity. Moreover, there are concerns about the corporate control of genetic technologies in agriculture, with a few companies potentially controlling the global food supply. Despite these concerns, proponents of genetic engineering argue that the technology has the potential to solve some of the world’s most pressing challenges, including climate change, hunger, and disease. They contend that responsible regulation and oversight can mitigate the risks and ensure that the technology is used ethically and for the benefit of all. Ultimately, the ethics of genetic engineering require a delicate balance between innovation and caution. As gene editing technologies continue to evolve, it will be crucial to have ongoing public debates and discussions to ensure that the moral implications of these advancements are fully understood and addressed.',
        images: ['https://images.unsplash.com/photo-1562001009-0f6f6b6efbc9'],
        sectionId: getSectionId('Science'),
        tags: getTagIds(['Science', 'Ethics']),
        author: reporterProfile2._id,
        editor: getEditorForSection(getSectionId('Science')),
        slug: generateSlug('The Ethics of Genetic Engineering'),
        status: 'published',
        publishedAt: today
      },
      {
        title: 'The Future of Renewable Energy',
        description: 'Exploring the potential of renewable energy to replace fossil fuels and combat climate change.',
        content:
          'As the world grapples with the environmental consequences of fossil fuel use, renewable energy sources such as solar, wind, and hydropower have emerged as critical solutions to reduce greenhouse gas emissions and mitigate climate change. The transition to renewable energy is not without its challenges, but the benefits are undeniable. Solar power, for example, has seen dramatic decreases in cost over the past decade, making it more accessible for homeowners and businesses alike. Wind energy, both onshore and offshore, is rapidly expanding, and technological innovations in energy storage are making it possible to store energy for when it’s needed most. One of the biggest advantages of renewable energy is its sustainability. Unlike fossil fuels, which are finite and polluting, renewable resources are abundant and clean. Solar panels can harness energy from the sun for decades, while wind turbines can capture the power of the wind for the foreseeable future. The transition to renewable energy also has significant economic benefits. The renewable energy sector is a major source of job creation, with thousands of new jobs being created in solar panel installation, wind turbine manufacturing, and energy storage technologies. As governments and businesses continue to invest in green technologies, the sector is expected to grow even further. Despite the promise of renewable energy, there are obstacles that must be addressed. For one, transitioning to a fully renewable energy grid requires significant infrastructure investments and technological innovation. Additionally, energy storage remains a challenge, as renewable energy production is intermittent – the sun doesn’t always shine, and the wind doesn’t always blow. However, advancements in battery technology and grid management are making it increasingly feasible to integrate renewable energy into existing power grids. In conclusion, the future of renewable energy is bright, and the continued investment in solar, wind, and other clean energy sources will be key to combating climate change and securing a sustainable energy future for generations to come.',
        images: ['https://images.unsplash.com/photo-1560957482-6e9ec56cd27b'],
        sectionId: getSectionId('Technology'),
        tags: getTagIds(['Technology']),
        author: reporterProfile2._id,
        editor: getEditorForSection(getSectionId('Economy')),
        slug: generateSlug('The Future of Renewable Energy'),
        status: 'published',
        publishedAt: today
      },
      {
        title: 'AI and the Job Market: Opportunities and Challenges',
        description: 'Examining how artificial intelligence is transforming the job market and its impact on employment.',
        content:
          'Artificial intelligence (AI) is transforming every industry, from healthcare to finance, education to manufacturing. As AI technologies continue to evolve, they are reshaping the job market in profound ways. On one hand, AI has the potential to create new job opportunities by enabling businesses to innovate and expand. For instance, the rise of AI has spurred demand for AI specialists, data scientists, and machine learning engineers, among other tech-related roles. Additionally, AI can help increase productivity by automating repetitive tasks, allowing workers to focus on more complex and creative aspects of their jobs. However, this same automation poses challenges. As AI systems become more capable, there is concern that many jobs, especially those in manual labor or administrative tasks, could be at risk. From retail clerks to truck drivers, jobs that once required human labor are increasingly being replaced by AI-powered robots and algorithms. The displacement of workers could exacerbate income inequality and lead to significant disruptions in the economy. To navigate these challenges, workers will need to adapt to the changing job landscape by acquiring new skills. This has sparked debates about the role of education in preparing the workforce for an AI-driven future. Upskilling and reskilling programs that focus on digital literacy and advanced technical skills will be crucial to ensuring that workers can thrive in an increasingly automated world. In conclusion, while AI brings many opportunities, it also presents challenges that must be addressed proactively. By embracing lifelong learning and ensuring that the workforce is equipped to handle the changes brought by AI, society can harness the full potential of these technologies while minimizing their negative impacts.',
        images: ['https://images.unsplash.com/photo-1521747116042-5ecb5cdb17e9'],
        sectionId: getSectionId('Technology'),
        tags: getTagIds(['Technology']),
        author: reporterProfile2._id,
        editor: getEditorForSection(getSectionId('Technology')),
        slug: generateSlug('AI and the Job Market: Opportunities and Challenges'),
        status: 'published',
        publishedAt: today
      },
      {
        title: 'The Evolution of Space Exploration',
        description: 'A look at the history and future of space exploration, from the moon landings to Mars missions.',
        content:
          'Space exploration has come a long way since the early days of the Space Race, when the United States and the Soviet Union competed to dominate the cosmos. The landmark event of the 1969 Apollo 11 mission, in which astronauts Neil Armstrong and Buzz Aldrin became the first humans to land on the moon, marked the beginning of a new era of space exploration. Since then, space missions have become more complex, ambitious, and international in scope. One of the most exciting developments in recent years is the push to explore Mars. NASA’s Perseverance rover, which landed on Mars in 2021, is collecting data that will help scientists understand the planet’s history and its potential for supporting life. The idea of sending humans to Mars is no longer a distant dream; private companies such as SpaceX are working on developing the technology to make human missions to Mars a reality within the next decade. In addition to Mars, space agencies around the world are focusing on the exploration of asteroids, moons, and even the outer planets. For example, NASA’s Juno mission, which launched in 2011, is studying Jupiter’s atmosphere and magnetic field, providing new insights into the gas giant. Meanwhile, the European Space Agency’s Rosetta mission, which landed a probe on a comet in 2014, marked a major milestone in the study of the solar system’s origins. The future of space exploration also includes the development of space tourism. Private companies like Virgin Galactic and Blue Origin are working to make suborbital space flights accessible to civilians, opening up the final frontier to those who can afford it. While space tourism is still in its infancy, it could become a significant industry in the years to come. As space exploration continues to evolve, we are faced with new questions about the ethics of space colonization and the environmental impact of space travel. However, one thing is clear: the exploration of space will continue to inspire innovation, push the boundaries of human knowledge, and transform our understanding of the universe.',
        images: ['https://images.unsplash.com/photo-1531564123-44ff2e028c99'],
        sectionId: getSectionId('Technology'),
        tags: getTagIds(['Science']),
        author: reporterProfile2._id,
        editor: getEditorForSection(getSectionId('Technology')),
        slug: generateSlug('The Evolution of Space Exploration'),
        status: 'published',
        publishedAt: today
      },
      {
        title: 'The Rise of Electric Vehicles',
        description: 'How electric vehicles are changing the auto industry and reducing carbon emissions.',
        content:
          'Electric vehicles (EVs) have come a long way since their inception, moving from niche products to mainstream alternatives to traditional gasoline-powered cars. With concerns about climate change and the need to reduce greenhouse gas emissions, EVs are increasingly seen as an essential part of the solution to the world’s transportation challenges. One of the biggest drivers of the electric vehicle revolution is the growing awareness of the environmental impact of fossil fuel-powered transportation. Cars and trucks contribute significantly to air pollution and global warming, and transitioning to electric vehicles is one of the most effective ways to reduce carbon emissions in the transportation sector. As governments around the world set ambitious targets for reducing emissions, electric vehicles are becoming more accessible to the average consumer. Automakers are investing heavily in EV technology, and new models with longer ranges and faster charging times are hitting the market. Tesla, one of the most well-known electric vehicle manufacturers, has led the way in proving that EVs can be stylish, affordable, and practical. Other car manufacturers, such as Ford and General Motors, are following suit by releasing their own electric models. In addition to reducing emissions, EVs offer other advantages, such as lower operating costs and a reduced reliance on oil. Charging infrastructure is also improving, with more charging stations being built around the world. However, there are still challenges that need to be addressed before electric vehicles can become the dominant mode of transportation. One of the biggest hurdles is the cost of EVs, which is still higher than traditional gasoline-powered cars, although prices are steadily decreasing. Additionally, battery technology is improving, but there are still limitations in terms of range and charging speed. Despite these challenges, the future of electric vehicles looks promising, and as technology advances and infrastructure improves, EVs will continue to play a key role in reducing carbon emissions and helping the world transition to a more sustainable transportation system.',
        images: ['https://images.unsplash.com/photo-1573403920-77fe0d0c3a76'],
        sectionId: getSectionId('Economy'),
        tags: getTagIds(['Economy']),
        author: reporterProfile2._id,
        editor: getEditorForSection(getSectionId('Economy')),
        slug: generateSlug('The Rise of Electric Vehicles'),
        status: 'published',
        publishedAt: today
      },
      {
        title: 'Global Health in the 21st Century',
        description: 'Exploring the challenges and opportunities in global health today.',
        content:
          'Global health in the 21st century is facing unprecedented challenges and opportunities. With the rise of global interconnectedness, the health of populations in one part of the world can have a profound impact on the health of others. From the COVID-19 pandemic to the growing burden of chronic diseases, the global health landscape is constantly evolving. One of the most significant global health challenges today is the fight against infectious diseases. While diseases like malaria and tuberculosis continue to affect millions of people around the world, new threats have emerged, including COVID-19 and antibiotic-resistant bacteria. The global community must work together to prevent, detect, and respond to infectious disease outbreaks, particularly in low-income and vulnerable populations. Another challenge is the rise of non-communicable diseases (NCDs), such as heart disease, diabetes, and cancer, which are becoming more prevalent as populations age and lifestyles change. NCDs are now the leading cause of death globally, and addressing these diseases requires a focus on prevention, early detection, and access to affordable healthcare. In addition to these challenges, global health presents opportunities for innovation and improvement. Advances in medical technology, such as telemedicine and mobile health apps, are improving access to care, especially in remote or underserved areas. The development of new vaccines and treatments for diseases like malaria and HIV is also helping to save lives and reduce suffering. Furthermore, the global focus on health equity is driving efforts to address the social determinants of health, such as poverty, education, and access to clean water and sanitation. Achieving universal health coverage and ensuring that everyone has access to the care they need is a goal that is gaining traction worldwide. In conclusion, global health in the 21st century is a complex and multifaceted issue that requires a coordinated effort from governments, international organizations, the private sector, and civil society. By addressing both infectious and non-communicable diseases, embracing innovation, and prioritizing health equity, the global community can make significant strides in improving the health and well-being of populations around the world.',
        images: ['https://images.unsplash.com/photo-1521747116042-5ecb5cdb17e9'],
        sectionId: getSectionId('Health'),
        tags: getTagIds(['Health']),
        author: reporterProfile2._id,
        editor: getEditorForSection(getSectionId('Health')),
        slug: generateSlug('Global Health in the 21st Century'),
        status: 'published',
        publishedAt: today
      },
      {
        title: 'Electric Cars: A Step Toward a Greener Future',
        description: 'How electric vehicles are transforming the automotive industry and reducing carbon footprints.',
        content:
          'The automotive industry is undergoing a revolution, with electric vehicles (EVs) at the forefront of this change. With environmental concerns at an all-time high, the shift towards electric cars is seen as one of the most important steps in reducing global carbon emissions. Unlike traditional gasoline-powered vehicles, EVs produce zero tailpipe emissions, making them a more sustainable choice for transportation. Major car manufacturers like Tesla, Nissan, and Ford are leading the charge, offering EVs that are not only environmentally friendly but also stylish and high-performing. The reduction in operating costs is another major selling point for consumers, as EVs require less maintenance and are cheaper to fuel compared to their gas-powered counterparts. While challenges such as battery costs and charging infrastructure remain, advancements in battery technology and the expansion of charging networks are expected to solve these issues in the coming years. The future of electric vehicles looks promising, and as more consumers make the switch to electric, the automotive industry will continue to evolve toward a cleaner, greener future.',
        images: ['https://images.unsplash.com/photo-1514510876991-07eb4c93b8db'],
        sectionId: getSectionId('Economy'),
        tags: getTagIds(['Economy']),
        author: reporterProfile2._id,
        editor: getEditorForSection(getSectionId('Economy')),
        slug: generateSlug('Electric Cars: A Step Toward a Greener Future'),
        status: 'published',
        publishedAt: today
      },
      {
        title: 'AI in Healthcare: The Promise of Precision Medicine',
        description: 'How artificial intelligence is revolutionizing the healthcare sector and enabling personalized treatments.',
        content:
          'Artificial intelligence (AI) is transforming the healthcare industry by enabling more precise, efficient, and personalized treatment options. One of the most exciting applications of AI in healthcare is the development of precision medicine, which tailors treatment plans to an individual’s unique genetic makeup, lifestyle, and environment. By analyzing vast amounts of data from sources such as medical records, lab results, and genetic testing, AI algorithms can help doctors make more accurate diagnoses and predict the most effective treatments for patients. This approach has the potential to significantly improve patient outcomes and reduce the trial-and-error nature of traditional medicine. AI is also being used to enhance drug discovery, helping researchers identify promising compounds and predict their effectiveness before clinical trials. Additionally, AI-powered tools like virtual assistants and chatbots are improving patient care by providing real-time health information and support. While there are still challenges to overcome, such as data privacy concerns and the need for regulatory frameworks, AI’s potential to revolutionize healthcare is immense.',
        images: ['https://images.unsplash.com/photo-1517430816045-df4b7de6b6c5'],
        sectionId: getSectionId('Technology'),
        tags: getTagIds(['Health']),
        author: reporterProfile2._id,
        editor: getEditorForSection(getSectionId('Technology')),
        slug: generateSlug('AI in Healthcare: The Promise of Precision Medicine'),
        status: 'published',
        publishedAt: today
      },
      {
        title: 'The Impact of Social Media on Modern Politics',
        description: 'An in-depth look at how social media is shaping political discourse and influencing elections.',
        content:
          'Social media has transformed the way political discourse occurs, from election campaigns to grassroots movements. Platforms like Twitter, Facebook, and Instagram have become powerful tools for politicians to communicate directly with voters, bypassing traditional media channels. While this has democratized political engagement, it has also raised concerns about the spread of misinformation and the polarizing effects of social media. During election seasons, social media is often used to sway public opinion by spreading political advertisements, manipulating narratives, and even promoting fake news. These tactics have raised questions about the ethics of using social media for political gain. Additionally, social media algorithms prioritize content that generates strong emotional reactions, which can amplify divisive rhetoric and further entrench political polarization. Despite these challenges, social media remains a key element in modern politics, allowing politicians and activists to mobilize supporters and advocate for change. Moving forward, it will be crucial to address the ethical implications of social media in politics while preserving its potential to foster democratic participation.',
        images: ['https://images.unsplash.com/photo-1567787410-68f07fbdba33'],
        sectionId: getSectionId('Politics'),
        tags: getTagIds(['Politics']),
        author: reporterProfile2._id,
        editor: getEditorForSection(getSectionId('Politics')),
        slug: generateSlug('The Impact of Social Media on Modern Politics'),
        status: 'published',
        publishedAt: today
      },
      {
        title: 'The Rise of Women in Sports',
        description: 'A celebration of the increasing representation of women in sports at all levels.',
        content:
          'In recent years, there has been a significant increase in the visibility and representation of women in sports. From the dominance of Serena Williams in tennis to the success of the U.S. women’s national soccer team, female athletes are breaking records, shattering stereotypes, and inspiring future generations. The rise of women’s sports can be attributed to a combination of factors, including increased media coverage, investment in women’s leagues, and changing cultural attitudes toward gender equality. Title IX, a U.S. federal law passed in 1972, was a landmark moment in the fight for gender equality in sports, mandating equal opportunities for men and women in educational programs and athletics. Today, women’s sports continue to gain traction, with more opportunities for women to compete at the highest levels. However, challenges still remain, particularly in terms of pay equity and recognition. Despite these obstacles, the increasing prominence of female athletes is a testament to the progress that has been made and the bright future of women’s sports.',
        images: ['https://images.unsplash.com/photo-1576820653674-2677bb875eff'],
        sectionId: getSectionId('Sports'),
        tags: getTagIds(['Sports']),
        author: reporterProfile2._id,
        editor: getEditorForSection(getSectionId('Sports')),
        slug: generateSlug('The Rise of Women in Sports'),
        status: 'published',
        publishedAt: today
      },
      {
        title: 'The State of Global Economy Amid Post-Pandemic Recovery',
        description: 'Analyzing the state of the global economy as countries work toward recovery after the COVID-19 pandemic.',
        content:
          'The COVID-19 pandemic has had a profound impact on the global economy, causing widespread disruptions and forcing governments to implement unprecedented measures to protect public health and support businesses. As countries begin to recover from the pandemic, the global economy faces both opportunities and challenges. On the positive side, many countries have seen a rebound in economic growth, as vaccination efforts have allowed for the easing of lockdown restrictions and the reopening of businesses. Global trade is recovering, and industries such as technology, e-commerce, and healthcare are thriving. However, the economic recovery is uneven, with some regions and sectors lagging behind. The pandemic has exacerbated existing inequalities, and many developing countries are struggling to access vaccines and financial support. Furthermore, supply chain disruptions, rising inflation, and labor shortages are creating new challenges for businesses and policymakers. The path to a full economic recovery will require international cooperation, investment in green technologies, and efforts to address social and economic inequalities. As countries continue to rebuild, it will be essential to focus on long-term growth and sustainability to ensure that the global economy emerges stronger and more resilient.',
        images: ['https://images.unsplash.com/photo-1578914602120-c70d09142a8d'],
        sectionId: getSectionId('Economy'),
        tags: getTagIds(['Economy']),
        author: reporterProfile2._id,
        editor: getEditorForSection(getSectionId('Economy')),
        slug: generateSlug('The State of Global Economy Amid Post-Pandemic Recovery'),
        status: 'published',
        publishedAt: today
      },
      {
        title: 'The Rise of Esports: A New Era in Competitive Gaming',
        description: 'Esports has evolved from niche hobby to a global phenomenon, with tournaments drawing millions of viewers.',
        content:
          'Esports, or electronic sports, has seen an explosive rise in popularity over the last decade. What started as small-scale, local competitions has now grown into a multi-billion-dollar industry, with professional leagues and global tournaments. Titles like League of Legends, Dota 2, and Counter-Strike: Global Offensive have millions of fans, while players and teams are now seen as celebrities. What was once considered a pastime for gamers has become a legitimate career path, with esports players earning hefty salaries from sponsorships, streaming, and tournament winnings. Major brands, including Nike and Coca-Cola, have invested in the space, further legitimizing esports as a viable commercial industry. Additionally, esports has become a platform for education, as colleges and universities are now offering scholarships for talented gamers. The rise of esports is also changing how people view video games, with competitive gaming gaining the same level of respect as traditional sports. As the industry continues to grow, the future of esports looks incredibly promising, with new games, platforms, and opportunities emerging every year.',
        images: ['https://images.unsplash.com/photo-1522204531232-3b8e9a1f7550'],
        sectionId: getSectionId('Sports'),
        tags: getTagIds(['Sports', 'Breaking News']),
        author: reporterProfile2._id,
        editor: getEditorForSection(getSectionId('Sports')),
        slug: generateSlug('The Rise of Esports: A New Era in Competitive Gaming'),
        status: 'published',
        publishedAt: today
      },
      {
        title: 'The Impact of Sleep on Athletic Performance',
        description: 'How adequate rest can elevate sports performance and speed up recovery for athletes.',
        content:
          'Sleep is a crucial aspect of an athlete’s training regimen, often underestimated despite its importance. Research has shown that sleep plays a critical role in enhancing performance, increasing stamina, and improving overall recovery. During sleep, the body undergoes processes that repair muscle tissue, restore energy, and consolidate memories. For athletes, getting quality sleep is essential for peak performance during training and competition. Lack of sleep can lead to decreased cognitive function, slower reaction times, and an increased risk of injury. Many professional athletes, from football players to Olympic gold medalists, have emphasized the importance of prioritizing rest as part of their preparation. Sleep deprivation can also hinder the immune system, making athletes more susceptible to illness. Recent studies have revealed that athletes who get an optimal amount of sleep perform better in their sports and recover faster. With sports science advancing, experts are now advising athletes to monitor their sleep patterns using wearable technology to ensure they are getting the rest they need.',
        images: ['https://images.unsplash.com/photo-1521747116042-5a810fda9664'],
        sectionId: getSectionId('Health'),
        tags: getTagIds(['Health', 'Sports']),
        author: reporterProfile2._id,
        editor: getEditorForSection(getSectionId('Health')),
        slug: generateSlug('The Impact of Sleep on Athletic Performance'),
        status: 'published',
        publishedAt: today
      },
      {
        title: 'The Future of Cryptocurrency in the Global Economy',
        description: 'Examining the role of cryptocurrency and blockchain technology in shaping the future of finance.',
        content:
          'Cryptocurrency has rapidly transformed from a fringe financial product to a mainstream asset class, disrupting traditional finance and creating a new digital economy. Bitcoin, Ethereum, and other cryptocurrencies have paved the way for decentralized finance (DeFi), which allows users to access financial services without intermediaries like banks. Cryptocurrencies rely on blockchain technology, a secure and transparent method of recording transactions that has the potential to revolutionize industries beyond finance, such as supply chain management, healthcare, and even voting systems. The global economy is becoming increasingly interconnected, and cryptocurrency is playing a key role in facilitating cross-border transactions with minimal fees and faster processing times. However, the volatility of cryptocurrencies remains a challenge, as prices can fluctuate dramatically. Governments around the world are still grappling with how to regulate cryptocurrencies, and questions around their legality, taxation, and potential for use in illicit activities persist. Despite these challenges, cryptocurrency is undeniably shaping the future of the global economy. As blockchain technology evolves and adoption increases, we may see traditional financial institutions incorporating crypto into their services, further legitimizing its place in the global financial system.',
        images: ['https://images.unsplash.com/photo-1573164574398-d4d65f39ec40'],
        sectionId: getSectionId('Economy'),
        tags: getTagIds(['Economy', 'Breaking News']),
        author: reporterProfile2._id,
        editor: getEditorForSection(getSectionId('Economy')),
        slug: generateSlug('The Future of Cryptocurrency in the Global Economy'),
        status: 'published',
        publishedAt: today
      },
      {
        title: 'The Growing Role of Telemedicine in Healthcare',
        description: 'How telemedicine is revolutionizing healthcare delivery, especially during the COVID-19 pandemic.',
        content:
          'Telemedicine has emerged as a game-changer in the healthcare industry, especially in the wake of the COVID-19 pandemic. The ability to consult with a doctor remotely through video calls, phone consultations, and secure messaging platforms has made healthcare more accessible, particularly for those living in rural or underserved areas. With the rise of telemedicine, patients can now receive medical advice, prescriptions, and follow-up care without leaving the comfort of their homes. This shift has also helped alleviate the strain on healthcare systems, reducing the number of in-person visits and minimizing the risk of exposure to infectious diseases. During the pandemic, telemedicine became a vital tool in providing care while minimizing disruptions to services. Many healthcare providers quickly adopted telemedicine solutions, and patients have reported high levels of satisfaction with virtual consultations. Additionally, telemedicine has opened the door to more personalized and timely care, with some platforms allowing patients to communicate with specialists from around the world. As technology continues to advance, telemedicine is expected to become an integral part of the healthcare system, offering convenience, affordability, and accessibility to patients globally.',
        images: ['https://images.unsplash.com/photo-1593709730217-07fc1c7db4fc'],
        sectionId: getSectionId('Health'),
        tags: getTagIds(['Health']),
        author: reporterProfile2._id,
        editor: getEditorForSection(getSectionId('Health')),
        slug: generateSlug('The Growing Role of Telemedicine in Healthcare'),
        status: 'published',
        publishedAt: today
      },
      {
        title: 'The Importance of Financial Literacy in Today’s Economy',
        description: 'Why financial literacy is essential for individuals and how it can empower people to make informed financial decisions.',
        content:
          'In today’s complex economy, financial literacy has become more important than ever. Understanding how money works—from budgeting and saving to investing and managing debt—can empower individuals to make smarter decisions with their finances. Many people struggle with basic financial concepts, and this lack of knowledge can lead to poor financial decisions, such as overspending, accumulating high levels of debt, or failing to save for retirement. Financial literacy is not only important for personal well-being but also for broader economic stability. When individuals are financially literate, they are more likely to save, invest, and plan for the future, leading to stronger communities and a healthier economy. Schools, non-profits, and financial institutions have begun to recognize the need for education around personal finance. Many schools are introducing financial literacy programs to teach students the basics of budgeting, saving, and investing. Financial institutions are also offering resources to help customers better understand the financial products they use. With greater financial literacy, individuals are better equipped to navigate the complexities of today’s economy and achieve long-term financial security.',
        images: ['https://images.unsplash.com/photo-1567427007-3da6e59304f1'],
        sectionId: getSectionId('Economy'),
        tags: getTagIds(['Economy']),
        author: reporterProfile2._id,
        editor: getEditorForSection(getSectionId('Economy')),
        slug: generateSlug('The Importance of Financial Literacy in Today’s Economy'),
        status: 'published',
        publishedAt: today
      }
    ];

    // Chèn bài viết vào database
    const insertedArticles = await Article.insertMany(articleData);

    // Cập nhật bài viết vào ReporterProfile
    reporterProfile.reportArticles = insertedArticles.map((article) => article._id) as mongoose.Types.ObjectId[];
    await reporterProfile.save();

    console.log('Articles seeded successfully and linked to reporter and editors:', insertedArticles);
  } catch (err) {
    console.error('Error seeding articles, reporter, and editors:', err);
  }
};

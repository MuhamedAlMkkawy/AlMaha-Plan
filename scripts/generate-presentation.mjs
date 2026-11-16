import pptxgen from 'pptxgenjs';
import * as path from 'path';

async function generatePresentation() {
  const pptx = new pptxgen();

  pptx.layout = 'LAYOUT_16x9';
  pptx.rtlMode = true; // Arabic RTL presentation

  // Design Tokens
  const C_EMERALD = '126B58';
  const C_DEEP_FOREST = '174A40';
  const C_DARK_EMERALD = '0D5143';
  const C_SAND_GOLD = 'B89A68';
  const C_LIGHT_CHAMPAGNE = 'D8C5A0';
  const C_WARM_SAND = 'F5F1E8';
  const C_SOFT_IVORY = 'FAF9F5';
  const C_DARK_SLATE = '293B36';
  const C_MUTED_SLATE = '718078';
  const C_WHITE = 'FFFFFF';

  // Helper for slide base styling
  const addHeaderAndFooter = (slide, title, category) => {
    // Top banner
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 0, y: 0, w: '100%', h: 1.1,
      fill: { color: C_DEEP_FOREST }
    });
    // Gold hairline
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 0, y: 1.1, w: '100%', h: 0.05,
      fill: { color: C_SAND_GOLD }
    });
    // Category pill
    slide.addText(category, {
      x: 0.8, y: 0.18, w: 10, h: 0.3,
      fontSize: 11, fontFace: 'Arial', bold: true, color: C_LIGHT_CHAMPAGNE,
      rtl: true, align: 'right'
    });
    // Slide Title
    slide.addText(title, {
      x: 0.8, y: 0.45, w: 11, h: 0.5,
      fontSize: 20, fontFace: 'Arial', bold: true, color: C_WHITE,
      rtl: true, align: 'right'
    });
    // Bottom footer bar
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 0, y: 7.15, w: '100%', h: 0.35,
      fill: { color: C_SOFT_IVORY },
      line: { color: 'E5E9E5', width: 1 }
    });
    slide.addText('مخطط المها / مها الشرق (رقم 4047) — العرض التعريفي الشامل للإدارة العليا', {
      x: 0.8, y: 7.2, w: 10, h: 0.25,
      fontSize: 10, fontFace: 'Arial', color: C_MUTED_SLATE,
      rtl: true, align: 'right'
    });
  };

  // ----------------------------------------------------
  // SLIDE 1: COVER SLIDE
  // ----------------------------------------------------
  {
    const slide = pptx.addSlide();
    slide.background = { color: C_DEEP_FOREST };

    // Decorative shape
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: 0.8, w: 11.7, h: 5.9,
      fill: { color: C_DARK_EMERALD },
      line: { color: C_SAND_GOLD, width: 2 },
      rectRadius: 0.3
    });

    slide.addText('منظومة المبيعات وإدارة المخططات العقارية المتقدمة', {
      x: 1.2, y: 1.5, w: 10.9, h: 0.5,
      fontSize: 14, fontFace: 'Arial', bold: true, color: C_LIGHT_CHAMPAGNE,
      rtl: true, align: 'center'
    });

    slide.addText('بوابة مبيعات مخطط المها\n(مها الشرق — مخطط رقم 4047)', {
      x: 1.2, y: 2.1, w: 10.9, h: 1.6,
      fontSize: 34, fontFace: 'Arial', bold: true, color: C_WHITE,
      rtl: true, align: 'center'
    });

    // Gold divider
    slide.addShape(pptx.shapes.LINE, {
      x: 4.8, y: 3.9, w: 3.7, h: 0,
      line: { color: C_SAND_GOLD, width: 3 }
    });

    slide.addText('عرض تعريفي شامل للإدارة العليا بخصائص ومميزات النظام ونظام الصلاحيات وتصميم الزمرد والرمال', {
      x: 1.5, y: 4.2, w: 10.3, h: 0.8,
      fontSize: 14, fontFace: 'Arial', color: C_WARM_SAND,
      rtl: true, align: 'center'
    });

    slide.addText('الجهة المالكة: شركة القادسية الأولى  |  المسوق الحصري: شركة تارقيت العقارية', {
      x: 1.5, y: 5.3, w: 10.3, h: 0.5,
      fontSize: 12, fontFace: 'Arial', bold: true, color: C_LIGHT_CHAMPAGNE,
      rtl: true, align: 'center'
    });
  }

  // ----------------------------------------------------
  // SLIDE 2: EXECUTIVE SUMMARY & OBJECTIVES
  // ----------------------------------------------------
  {
    const slide = pptx.addSlide();
    slide.background = { color: C_SOFT_IVORY };
    addHeaderAndFooter(slide, 'الرؤية العامة والأهداف الاستراتيجية', 'نظرة عامة على المنظومة');

    // 3 Cards
    const cards = [
      {
        title: 'الربط المباشر اللحظي',
        desc: 'قراءة وتحديث بيانات 973 قطعة أرض متصلة مباشرة بجدول Google Sheets الرسمي كمرجع موحد دون أي تضارب أو تأخير.',
        badge: 'دقة البيانات'
      },
      {
        title: 'حماية البيانات وحوكمة الوصول',
        desc: 'فصل صارم بين الزائر والعميل وفريق المبيعات، مع حجب كامل لبيانات المشترين والصكوك عن غير المصرح لهم.',
        badge: 'أمان وسرية'
      },
      {
        title: 'أتمتة عروض الأسعار والعقود',
        desc: 'إصدار فوري لعروض الأسعار المعتمدة وطباعة عقود الشراء والشروط النظامية بضغطة زر وبمعادلات مالية دقيقة.',
        badge: 'كفاءة وسرعة'
      }
    ];

    cards.forEach((c, idx) => {
      const xPos = 0.8 + idx * 4.0;
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: xPos, y: 1.6, w: 3.7, h: 5.0,
        fill: { color: C_WHITE },
        line: { color: 'E5E9E5', width: 1.5 },
        rectRadius: 0.2
      });

      // Accent top bar
      slide.addShape(pptx.shapes.RECTANGLE, {
        x: xPos, y: 1.6, w: 3.7, h: 0.15,
        fill: { color: idx === 1 ? C_SAND_GOLD : C_EMERALD }
      });

      slide.addText(c.badge, {
        x: xPos + 0.3, y: 1.9, w: 3.1, h: 0.35,
        fontSize: 11, fontFace: 'Arial', bold: true, color: C_SAND_GOLD,
        rtl: true, align: 'right'
      });

      slide.addText(c.title, {
        x: xPos + 0.3, y: 2.3, w: 3.1, h: 0.6,
        fontSize: 16, fontFace: 'Arial', bold: true, color: C_DARK_SLATE,
        rtl: true, align: 'right'
      });

      slide.addText(c.desc, {
        x: xPos + 0.3, y: 3.0, w: 3.1, h: 3.2,
        fontSize: 13, fontFace: 'Arial', color: C_MUTED_SLATE,
        rtl: true, align: 'right', lineSpacing: 22
      });
    });
  }

  // ----------------------------------------------------
  // SLIDE 3: THREE HEADER EXPERIENCES
  // ----------------------------------------------------
  {
    const slide = pptx.addSlide();
    slide.background = { color: C_SOFT_IVORY };
    addHeaderAndFooter(slide, 'هندسة واجهات الاستخدام: تجربة مخصصة لكل مستخدم', 'الهوية البصرية وتجربة المستخدم');

    const headers = [
      {
        name: 'أ. الترويسة العامة (Public Header)',
        target: 'لزوار المنصة والعملاء في صفحة الهبوط',
        style: 'خلفية بيضاء نقية مع تفاصيل زمردية ولمسات ذهبية رملية',
        rules: 'تعرض فقط روابط تعريفية وزر "دخول الموظفين". تحجب تماماً القطع والأسعار والإحصائيات.'
      },
      {
        name: 'ب. ترويسة الموظف (Employee Header)',
        target: 'لمنسوبي وفريق المبيعات المصرح لهم',
        style: 'خلفية ناصعة مع خط علوي زمردي رفيع وخلفيات تفاعلية ناعمة (Soft Sage)',
        rules: 'تعرض حصرياً الروابط والأقسام التي يمتلك الموظف صلاحية عليها، مع شارة تعريفية بالاسم والصفة.'
      },
      {
        name: 'ج. ترويسة الإدارة (Admin Header)',
        target: 'للإدارة العليا ومدراء النظام التنفيذيين',
        style: 'خلفية فخمة بلون الغابة العميقة (Deep Forest) مع تطعيمات بالذهب الرملي',
        rules: 'وصول شامل لأدوات التحكم: إدارة الموظفين، سجل العمليات، إدارة القطع، وإعدادات المخطط.'
      }
    ];

    headers.forEach((h, idx) => {
      const yPos = 1.6 + idx * 1.75;
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.8, y: yPos, w: 11.7, h: 1.55,
        fill: { color: C_WHITE },
        line: { color: idx === 2 ? C_SAND_GOLD : 'E5E9E5', width: 1.5 },
        rectRadius: 0.15
      });

      // Side colored stripe
      slide.addShape(pptx.shapes.RECTANGLE, {
        x: 12.35, y: yPos, w: 0.15, h: 1.55,
        fill: { color: idx === 2 ? C_DEEP_FOREST : C_EMERALD }
      });

      slide.addText(h.name, {
        x: 1.0, y: yPos + 0.15, w: 11.1, h: 0.35,
        fontSize: 15, fontFace: 'Arial', bold: true, color: idx === 2 ? C_DEEP_FOREST : C_EMERALD,
        rtl: true, align: 'right'
      });

      slide.addText(`المستهدف: ${h.target}`, {
        x: 1.0, y: yPos + 0.52, w: 11.1, h: 0.3,
        fontSize: 12, fontFace: 'Arial', bold: true, color: C_DARK_SLATE,
        rtl: true, align: 'right'
      });

      slide.addText(`التصميم: ${h.style} — ${h.rules}`, {
        x: 1.0, y: yPos + 0.85, w: 11.1, h: 0.55,
        fontSize: 12, fontFace: 'Arial', color: C_MUTED_SLATE,
        rtl: true, align: 'right'
      });
    });
  }

  // ----------------------------------------------------
  // SLIDE 4: DASHBOARD & ANALYTICS
  // ----------------------------------------------------
  {
    const slide = pptx.addSlide();
    slide.background = { color: C_SOFT_IVORY };
    addHeaderAndFooter(slide, 'لوحة المؤشرات والتحليلات البيانية اللحظية', 'متابعة المبيعات والتقارير');

    const metrics = [
      { label: 'إجمالي القطع', val: '973 قطعة', note: 'موزعة على 41 بلك و4 زونات' },
      { label: 'إجمالي المساحة', val: 'ملايين م²', note: 'مساحات سكنية وتجارية ومرافق' },
      { label: 'القيمة التقديرية', val: 'مئات الملايين', note: 'احتساب تلقائي خالي من الأخطاء' },
      { label: 'المتوسط العام', val: 'ر.س / م²', note: 'معدل سعر المتر لكامل المخطط' }
    ];

    metrics.forEach((m, idx) => {
      const xPos = 0.8 + idx * 3.0;
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: xPos, y: 1.6, w: 2.75, h: 1.6,
        fill: { color: C_WHITE },
        line: { color: 'E5E9E5', width: 1.5 },
        rectRadius: 0.15
      });
      slide.addText(m.label, {
        x: xPos + 0.2, y: 1.75, w: 2.35, h: 0.3,
        fontSize: 11, fontFace: 'Arial', bold: true, color: C_MUTED_SLATE,
        rtl: true, align: 'right'
      });
      slide.addText(m.val, {
        x: xPos + 0.2, y: 2.1, w: 2.35, h: 0.5,
        fontSize: 18, fontFace: 'Arial', bold: true, color: C_EMERALD,
        rtl: true, align: 'right'
      });
      slide.addText(m.note, {
        x: xPos + 0.2, y: 2.65, w: 2.35, h: 0.4,
        fontSize: 10, fontFace: 'Arial', color: C_DARK_SLATE,
        rtl: true, align: 'right'
      });
    });

    // Lower comparison box
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: 3.5, w: 11.7, h: 3.3,
      fill: { color: C_WHITE },
      line: { color: 'E5E9E5', width: 1.5 },
      rectRadius: 0.2
    });

    slide.addText('مميزات لوحة الإحصائيات الذكية:', {
      x: 1.2, y: 3.75, w: 10.9, h: 0.4,
      fontSize: 15, fontFace: 'Arial', bold: true, color: C_DARK_SLATE,
      rtl: true, align: 'right'
    });

    const bullets = [
      '• رسم بياني تفاعلي (Doughnut Chart) لحالة المبيعات: متاح للبيع (زمردي)، محجوز (ذهبي رملي)، مباع (أحمر ناعم).',
      '• إمكانية الضغط على أي شريحة في الرسم للانتقال المباشر لجدول القطع مع تصفية فورية مطابقة.',
      '• رسوم بيانية تفاعلية متعددة الأنماط (مجمّع أو متجاور) لتحليل المساحات والقيم الإجمالية ومتوسط الأسعار حسب الاستخدام.',
      '• جدول تفصيلي كامل يماثل تقرير Rep المعتمد في الإكسل، يعرض نسب المساحات والقيم دون فقدان أي معلومة.',
      '• أزرار استكشاف سريعة للبلوكات والزونات تتيح التنقل السلس بين أقسام المخطط.'
    ];

    slide.addText(bullets.join('\n\n'), {
      x: 1.2, y: 4.25, w: 10.9, h: 2.3,
      fontSize: 12, fontFace: 'Arial', color: C_DARK_SLATE,
      rtl: true, align: 'right', lineSpacing: 20
    });
  }

  // ----------------------------------------------------
  // SLIDE 5: PLOTS, BLOCKS & ZONES EXPLORER
  // ----------------------------------------------------
  {
    const slide = pptx.addSlide();
    slide.background = { color: C_SOFT_IVORY };
    addHeaderAndFooter(slide, 'إدارة واستعراض الأراضي والبلوكات والزونات', 'محرك البحث والتصفية المتقدم');

    const features = [
      {
        title: 'جدول القطع والمبيعات',
        points: [
          'بحث ذكي فوري برقم القطعة، البلك، أو الزون.',
          'تصفية متعددة بحالة البيع (متاح / محجوز / مباع) ونوع الاستخدام.',
          'عرض أسعار المتر، القيمة، السعي، وضريبة التصرفات العقارية بدقة.',
          'تصدير البيانات المصفاة بصيغة CSV وExcel بضغطة زر.'
        ]
      },
      {
        title: 'استعراض البلوكات والزونات',
        points: [
          'بطاقات بصرية لـ 41 بلك تعرض نسب المبيعات والمتاح والمحجوز.',
          'صفحة تفصيلية لكل بلك تستعرض أراضيه كبلاطات تفاعلية ملونة.',
          'استعراض قطاعات المخطط حسب الزونات (A1, A2, B1, B2).',
          'تصميم مرن وسريع يسهل على المندوب تقديم المعلومة للعميل فوراً.'
        ]
      }
    ];

    features.forEach((f, idx) => {
      const xPos = 0.8 + idx * 6.0;
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: xPos, y: 1.6, w: 5.7, h: 5.1,
        fill: { color: C_WHITE },
        line: { color: 'E5E9E5', width: 1.5 },
        rectRadius: 0.2
      });

      slide.addShape(pptx.shapes.RECTANGLE, {
        x: xPos, y: 1.6, w: 5.7, h: 0.15,
        fill: { color: idx === 0 ? C_EMERALD : C_SAND_GOLD }
      });

      slide.addText(f.title, {
        x: xPos + 0.4, y: 2.0, w: 4.9, h: 0.4,
        fontSize: 16, fontFace: 'Arial', bold: true, color: C_DARK_SLATE,
        rtl: true, align: 'right'
      });

      slide.addText(f.points.map(p => `• ${p}`).join('\n\n'), {
        x: xPos + 0.4, y: 2.6, w: 4.9, h: 3.8,
        fontSize: 13, fontFace: 'Arial', color: C_MUTED_SLATE,
        rtl: true, align: 'right', lineSpacing: 24
      });
    });
  }

  // ----------------------------------------------------
  // SLIDE 6: QUOTATIONS & CONTRACT GENERATION
  // ----------------------------------------------------
  {
    const slide = pptx.addSlide();
    slide.background = { color: C_SOFT_IVORY };
    addHeaderAndFooter(slide, 'صانع عروض الأسعار وطباعة العقود الرسمية', 'أتمتة المبيعات والتعاقد');

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: 1.6, w: 11.7, h: 5.1,
      fill: { color: C_WHITE },
      line: { color: 'E5E9E5', width: 1.5 },
      rectRadius: 0.2
    });

    slide.addText('آلية إصدار عروض الأسعار ونماذج الشراء المعتمدة:', {
      x: 1.2, y: 1.9, w: 10.9, h: 0.4,
      fontSize: 16, fontFace: 'Arial', bold: true, color: C_DARK_SLATE,
      rtl: true, align: 'right'
    });

    const quotationSteps = [
      '1. اختيار مرن من 1 إلى 10 قطع: إمكانية تحديد عدة أراضٍ للعميل الواحد في عرض سعر موحد.',
      '2. احتساب مالي دقيق وآلي: حساب قيمة الأرض، السعي شاملاً الضريبة (2.5% × 1.15)، وضريبة التصرفات العقارية (5%).',
      '3. نصوص مصرفية وقانونية معتمدة: توضيح إصدار شيك باسم المالك (شركة القادسية الأولى) وشيك السعي (شركة تارقيت العقارية).',
      '4. طباعة A4 فاخرة وحفظ كملف PDF: تنسيق مخصص للطباعة الورقية والحفظ الرقمي جاهز للإرسال الفوري للعملاء.',
      '5. تحرير وحفظ بيانات العقود: للمصرح لهم، يمكن تعديل بيانات المشتري (الاسم، الهوية، الجوال) وشروط العقد وحفظها مركزياً.'
    ];

    slide.addText(quotationSteps.join('\n\n'), {
      x: 1.2, y: 2.5, w: 10.9, h: 3.9,
      fontSize: 13, fontFace: 'Arial', color: C_DARK_SLATE,
      rtl: true, align: 'right', lineSpacing: 24
    });
  }

  // ----------------------------------------------------
  // SLIDE 7: PERMISSIONS & GOVERNANCE
  // ----------------------------------------------------
  {
    const slide = pptx.addSlide();
    slide.background = { color: C_SOFT_IVORY };
    addHeaderAndFooter(slide, 'حوكمة النظام ومصفوفة الصلاحيات (20 صلاحية تفصيلية)', 'الأمان وحوكمة العمليات');

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: 1.6, w: 11.7, h: 5.1,
      fill: { color: C_WHITE },
      line: { color: 'E5E9E5', width: 1.5 },
      rectRadius: 0.2
    });

    slide.addText('نظام إدارة الموظفين والصلاحيات الدقيقة:', {
      x: 1.2, y: 1.85, w: 10.9, h: 0.35,
      fontSize: 15, fontFace: 'Arial', bold: true, color: C_EMERALD,
      rtl: true, align: 'right'
    });

    slide.addText(
      'يمتلك مدير النظام لوحة تحكم كاملة لإضافة وتعديل الموظفين وتخصيص صلاحياتهم بدقة من بين 20 صلاحية مستقلة تشمل:\n' +
      '• صلاحيات الاستعراض: استعراض القطع، الإحصائيات، العقود، وتصدير البيانات.\n' +
      '• صلاحيات الإدارة والعمليات: إضافة وتعديل وأرشفة القطع والعقود.\n' +
      '• صلاحيات الصفحات الفردية (CRUD Granular): تحكم كامل في عرض وتعديل وإنشاء وحذف كل من (صفحة القطعة، صفحة البلوك، صفحة الزون).\n' +
      '• التحديث اللحظي (Live Auth): أي تعديل في صلاحيات الموظف أو تعطيل حسابه يسري في نفس اللحظة دون الحاجة لانتظار انتهاء الجلسة.',
      {
        x: 1.2, y: 2.3, w: 10.9, h: 2.0,
        fontSize: 12, fontFace: 'Arial', color: C_DARK_SLATE,
        rtl: true, align: 'right', lineSpacing: 20
      }
    );

    // Bottom highlight box: Audit log
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 1.2, y: 4.5, w: 10.9, h: 1.9,
      fill: { color: C_WARM_SAND },
      line: { color: C_SAND_GOLD, width: 1 },
      rectRadius: 0.15
    });

    slide.addText('سجل التدقيق والعمليات غير القابل للتعديل (Audit Log):', {
      x: 1.5, y: 4.65, w: 10.3, h: 0.3,
      fontSize: 13, fontFace: 'Arial', bold: true, color: C_DEEP_FOREST,
      rtl: true, align: 'right'
    });

    slide.addText(
      'تسجيل توثيقي كامل لكل عملية إضافة، تعديل، أو أرشفة مع توثيق اسم المستخدم، بريده، توقيت العملية بالثانية، وعنوان الـ IP، لضمان أعلى درجات النزاهة والمسؤولية الإدارية.',
      {
        x: 1.5, y: 5.0, w: 10.3, h: 1.2,
        fontSize: 12, fontFace: 'Arial', color: C_DARK_SLATE,
        rtl: true, align: 'right', lineSpacing: 18
      }
    );
  }

  // ----------------------------------------------------
  // SLIDE 8: SUMMARY & NEXT STEPS
  // ----------------------------------------------------
  {
    const slide = pptx.addSlide();
    slide.background = { color: C_DEEP_FOREST };

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 1.0, y: 1.0, w: 11.3, h: 5.5,
      fill: { color: C_DARK_EMERALD },
      line: { color: C_SAND_GOLD, width: 2 },
      rectRadius: 0.3
    });

    slide.addText('خلاصة القيمة المضافة للمشروع', {
      x: 1.5, y: 1.4, w: 10.3, h: 0.5,
      fontSize: 15, fontFace: 'Arial', bold: true, color: C_LIGHT_CHAMPAGNE,
      rtl: true, align: 'center'
    });

    slide.addText('منظومة رقمية رائدة تعكس مكانة مخطط المها', {
      x: 1.5, y: 1.9, w: 10.3, h: 0.7,
      fontSize: 26, fontFace: 'Arial', bold: true, color: C_WHITE,
      rtl: true, align: 'center'
    });

    const summaryPoints = [
      '✓ تحول رقمي كامل: التخلص من فوضى الجداول اليدوية وتوحيد مصدر الحقيقة في بوابة مركزية فائقة السرعة.',
      '✓ هوية فاخرة بالزمرد والذهب الرملي: تعزز ثقة العميل والمستثمر وتليق بمشروع نوعي معتمد.',
      '✓ أمان صارم وسرية تامة: حماية كاملة لأرقام الصكوك وهويات المشترين وحصرها على أصحاب الصلاحية.',
      '✓ مرونة تشغيلية عالية: سهولة تدريب فريق المبيعات والبدء الفوري في خدمة العملاء وإصدار العقود.'
    ];

    slide.addText(summaryPoints.join('\n\n'), {
      x: 1.8, y: 2.8, w: 9.7, h: 2.6,
      fontSize: 14, fontFace: 'Arial', color: C_WARM_SAND,
      rtl: true, align: 'right', lineSpacing: 24
    });

    slide.addText('شكراً لكم — جاهزون للأسئلة والاستفسارات', {
      x: 1.5, y: 5.6, w: 10.3, h: 0.4,
      fontSize: 13, fontFace: 'Arial', bold: true, color: C_LIGHT_CHAMPAGNE,
      rtl: true, align: 'center'
    });
  }

  // Save presentation
  const outputPath = 'd:/مخطط المها/عرض_تعريفي_مخطط_المها.pptx';
  await pptx.writeFile({ fileName: outputPath });
  console.log('Presentation generated successfully at:', outputPath);
}

generatePresentation().catch(err => {
  console.error('Failed to generate presentation:', err);
  process.exit(1);
});

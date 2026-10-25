import PptxGenJS from 'pptxgenjs';
import { LessonContent, Unit } from '../types/curriculum';

export async function exportLessonToPPTX(lesson: LessonContent, unit: Unit): Promise<void> {
  const pptx = new PptxGenJS();

  // Set presentation properties
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'طلاب الصف العاشر: هشام بن إسحاق الرحبي، يعرب بن بدر الدغيشي، حسن بن يعقوب البطراني';
  pptx.company = 'منصة الفنون الموسيقية - الصف العاشر';
  pptx.subject = lesson.title;
  pptx.title = `${lesson.title} - ${unit.title}`;

  // 1. Cover Slide
  const slide1 = pptx.addSlide();
  slide1.background = { color: '1C1917' }; // Warm rich stone-900

  // Decorative header band
  slide1.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: '100%',
    h: 0.35,
    fill: { color: 'D97706' }, // Amber accent
  });

  slide1.addText('سلطنة عمان - مادة الفنون الموسيقية - الصف العاشر', {
    x: 0.8,
    y: 0.9,
    w: 8.5,
    h: 0.4,
    fontSize: 16,
    color: 'D97706',
    bold: true,
    rtlMode: true,
    align: 'right',
  });

  slide1.addText(lesson.title, {
    x: 0.8,
    y: 1.5,
    w: 8.5,
    h: 1.1,
    fontSize: 32,
    color: 'FFFFFF',
    bold: true,
    rtlMode: true,
    align: 'right',
  });

  slide1.addText(`${unit.title} · ${lesson.subtitle}`, {
    x: 0.8,
    y: 2.7,
    w: 8.5,
    h: 0.6,
    fontSize: 18,
    color: 'A8A29E',
    rtlMode: true,
    align: 'right',
  });

  // Footer metadata
  slide1.addText('إعداد وتصميم طلاب الصف العاشر: هشام بن إسحاق الرحبي · يعرب بن بدر الدغيشي · حسن بن يعقوب البطراني', {
    x: 0.8,
    y: 4.8,
    w: 8.5,
    h: 0.4,
    fontSize: 12,
    color: 'D97706',
    bold: true,
    rtlMode: true,
    align: 'right',
  });

  // 2. Learning Objectives Slide
  const slide2 = pptx.addSlide();
  slide2.background = { color: 'FAFAF9' };

  slide2.addShape(pptx.ShapeType.rect, {
    x: 0.6,
    y: 0.5,
    w: 0.15,
    h: 0.6,
    fill: { color: 'D97706' },
  });

  slide2.addText('أهداف الدرس التعليمية', {
    x: 0.9,
    y: 0.5,
    w: 8.5,
    h: 0.6,
    fontSize: 24,
    color: '1C1917',
    bold: true,
    rtlMode: true,
    align: 'right',
  });

  const objectiveItems = lesson.objectives.map((obj, i) => ({
    text: `${i + 1}. ${obj}`,
    options: {
      fontSize: 16,
      color: '292524',
      breakLine: true,
      rtlMode: true,
      align: 'right' as const,
      lineSpacing: 28,
    },
  }));

  slide2.addText(objectiveItems, {
    x: 0.8,
    y: 1.5,
    w: 8.5,
    h: 3.2,
  });

  // 3. Key Concepts / Presentation Outline Slides
  lesson.presentationOutline.forEach((section, index) => {
    const slide = pptx.addSlide();
    slide.background = { color: 'FFFFFF' };

    // Slide header
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: '100%',
      h: 0.15,
      fill: { color: index % 2 === 0 ? 'D97706' : '0284C7' },
    });

    slide.addText(`المحور ${index + 1}: ${section.title}`, {
      x: 0.8,
      y: 0.6,
      w: 8.5,
      h: 0.6,
      fontSize: 22,
      color: '1C1917',
      bold: true,
      rtlMode: true,
      align: 'right',
    });

    const bulletItems = section.points.map((pt) => ({
      text: `• ${pt}`,
      options: {
        fontSize: 15,
        color: '44403C',
        breakLine: true,
        rtlMode: true,
        align: 'right' as const,
        lineSpacing: 24,
      },
    }));

    slide.addText(bulletItems, {
      x: 0.8,
      y: 1.5,
      w: 8.5,
      h: 3.2,
    });

    if (section.notes) {
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.8,
        y: 4.6,
        w: 8.5,
        h: 0.6,
        fill: { color: 'F5F5F4' },
        line: { color: 'E7E5E4', width: 1 },
      });
      slide.addText(`إضاءة تعليمية: ${section.notes}`, {
        x: 1.0,
        y: 4.65,
        w: 8.1,
        h: 0.5,
        fontSize: 12,
        color: '78716C',
        rtlMode: true,
        align: 'right',
      });
    }
  });

  // 4. Key Terms Slide
  if (lesson.keyTerms && lesson.keyTerms.length > 0) {
    const termsSlide = pptx.addSlide();
    termsSlide.background = { color: 'FAFAF9' };

    termsSlide.addText('المصطلحات والمفاهيم الموسيقية الأساسية', {
      x: 0.8,
      y: 0.6,
      w: 8.5,
      h: 0.6,
      fontSize: 22,
      color: '1C1917',
      bold: true,
      rtlMode: true,
      align: 'right',
    });

    const termItems = lesson.keyTerms.map((item) => ({
      text: `• [${item.term}]: ${item.definition}`,
      options: {
        fontSize: 14,
        color: '292524',
        breakLine: true,
        rtlMode: true,
        align: 'right' as const,
        lineSpacing: 22,
      },
    }));

    termsSlide.addText(termItems, {
      x: 0.8,
      y: 1.5,
      w: 8.5,
      h: 3.4,
    });
  }

  // 5. Final Slide: Review & Practice
  const endSlide = pptx.addSlide();
  endSlide.background = { color: '1C1917' };

  endSlide.addText('تم بحمد الله وتوفيقه', {
    x: 0.8,
    y: 1.6,
    w: 8.5,
    h: 0.8,
    fontSize: 28,
    color: 'FFFFFF',
    bold: true,
    rtlMode: true,
    align: 'center',
  });

  endSlide.addText('إعداد وتطوير طلاب الصف العاشر:\nهشام بن إسحاق الرحبي  ·  يعرب بن بدر الدغيشي  ·  حسن بن يعقوب البطراني', {
    x: 0.8,
    y: 2.5,
    w: 8.5,
    h: 0.8,
    fontSize: 16,
    color: 'D97706',
    bold: true,
    rtlMode: true,
    align: 'center',
  });

  endSlide.addText('جميع الحقوق محفوظة © لمنصة الفنون الموسيقية التفاعلية', {
    x: 0.8,
    y: 3.5,
    w: 8.5,
    h: 0.5,
    fontSize: 12,
    color: 'A8A29E',
    rtlMode: true,
    align: 'center',
  });

  const sanitizedFileName = `عرض_${lesson.title.replace(/\s+/g, '_')}_الصف_العاشر.pptx`;
  await pptx.writeFile({ fileName: sanitizedFileName });
}

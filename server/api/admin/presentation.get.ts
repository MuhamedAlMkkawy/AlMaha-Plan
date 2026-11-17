import { defineEventHandler, setHeader, createError } from 'h3';
import { requireAdmin } from '../../utils/auth';
import { createPresentationBuffer } from '../../services/presentation.service';

export default defineEventHandler(async (event) => {
  // Ensure only authenticated administrator can access and download this presentation
  requireAdmin(event);

  try {
    const buffer = await createPresentationBuffer();

    const filename = `مخطط_المها_عرض_تنفيذي_${new Date().toISOString().slice(0, 10)}.pptx`;
    const encodedFilename = encodeURIComponent(filename);

    setHeader(event, 'Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    setHeader(event, 'Content-Disposition', `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`);
    setHeader(event, 'Cache-Control', 'no-cache, no-store, must-revalidate');

    return buffer;
  } catch (err: any) {
    console.error('Error generating presentation export:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'تعذر إنشاء ملف العرض التقديمي. يرجى المحاولة لاحقاً.',
    });
  }
});

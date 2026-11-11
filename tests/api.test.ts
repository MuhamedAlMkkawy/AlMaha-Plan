import { describe, it, expect } from 'vitest';
import { PlotsRepository } from '../server/services/plots/plots.repository';
import { isAllowedAdminEmail } from '../server/utils/auth';

describe('Public & Security API Behavior', () => {
  it('should verify Plot 673 matches exact reference Sheet1 values', async () => {
    const plot = await PlotsRepository.getPublicPlotByNumber(673);
    expect(plot).not.toBeNull();
    expect(plot?.plotNo).toBe(673);
    expect(plot?.area).toBe(300);
    expect(plot?.pricePerM2).toBe(1700);
    expect(plot?.landValue).toBe(510000);
    expect(plot?.brokerage).toBe(14662.5);
    expect(plot?.retTax).toBe(25500);

    // Verify PII is NOT present
    expect((plot as any).buyerName).toBeUndefined();
    expect((plot as any).buyerPhone).toBeUndefined();
    expect((plot as any).deedNo).toBeUndefined();
  });

  it('should verify Plot 881 matches exact reference Sheet1 values', async () => {
    const plot = await PlotsRepository.getPublicPlotByNumber(881);
    expect(plot).not.toBeNull();
    expect(plot?.plotNo).toBe(881);
    expect(plot?.area).toBe(325);
    expect(plot?.pricePerM2).toBe(1800);
    expect(plot?.landValue).toBe(585000);
    expect(plot?.brokerage).toBe(16818.75);
    expect(plot?.retTax).toBe(29250);
  });

  it('should enforce admin email allowlist verification', () => {
    expect(isAllowedAdminEmail('admin@example.com')).toBe(true);
    expect(isAllowedAdminEmail('intruder@random.com')).toBe(false);
    expect(isAllowedAdminEmail('')).toBe(false);
  });

  it('should reject concurrency collision with 409 error', async () => {
    const plot = await PlotsRepository.getPlotByNumber(1);
    expect(plot).not.toBeNull();

    await expect(
      PlotsRepository.updatePlot(
        1,
        {
          pricePerM2: 2600,
          expectedHash: 'stale-hash-value-simulating-concurrent-edit',
        },
        'admin@example.com'
      )
    ).rejects.toThrow('تم تعديل هذا السجل من قبل مستخدم آخر');
  });
});


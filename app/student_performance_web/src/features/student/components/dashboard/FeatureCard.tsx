interface FeatureCardProps {
  title: string;
  feature: string;
  value: number;
  icon: string;
  color: 'best' | 'second' | 'third' | 'worst';
  description: string;
}

const colorMap = {
  best: {
    headerBg: 'bg-gradient-to-r from-[#1a2a6c] to-[#2d4373]',
    iconBg: 'bg-[#1a2a6c]',
    iconColor: 'text-white',
  },
  second: {
    headerBg: 'bg-gradient-to-r from-[#23578d] to-[#3a79b2]',
    iconBg: 'bg-[#23578d]',
    iconColor: 'text-white',
  },
  third: {
    headerBg: 'bg-gradient-to-r from-[#3a7aac] to-[#5a94c5]',
    iconBg: 'bg-[#3a7aac]',
    iconColor: 'text-white',
  },
  worst: {
    headerBg: 'bg-gradient-to-r from-[#2b5a8d] to-[#4a7aac]',
    iconBg: 'bg-[#2b5a8d]',
    iconColor: 'text-white',
  },
};

export const FeatureCard = ({ title, feature, value, icon, color, description }: FeatureCardProps) => {
  const styles = colorMap[color];

  return (
    <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-sm transition-transform hover:-translate-y-0.5 duration-200">
      <div className={`${styles.headerBg} px-6 py-5 flex items-start justify-between gap-4`}>
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="mt-2 text-2xl font-bold text-white leading-tight">{feature}</p>
        </div>
        <div className={`${styles.iconBg} ${styles.iconColor} rounded-full w-12 h-12 flex items-center justify-center text-xl shadow-lg`}>
          {icon}
        </div>
      </div>
      <div className="bg-white px-6 py-6">
        <p className="text-3xl font-bold text-slate-900">{value}%</p>
        <p className="mt-3 text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
};
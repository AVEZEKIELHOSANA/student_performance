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
    bg: 'bg-gradient-to-br from-[#1a2a6c] to-[#2d4373]',
    iconBg: 'bg-white/20',
    iconColor: 'text-white',
  },
  second: {
    bg: 'bg-gradient-to-br from-[#2d4373] to-[#3a5a8c]',
    iconBg: 'bg-white/20',
    iconColor: 'text-white',
  },
  third: {
    bg: 'bg-gradient-to-br from-[#4a6a9c] to-[#5a7aac]',
    iconBg: 'bg-white/20',
    iconColor: 'text-white',
  },
  worst: {
    bg: 'bg-gradient-to-br from-[#8a2a2a] to-[#aa3a3a]',
    iconBg: 'bg-white/20',
    iconColor: 'text-white',
  },
};

export const FeatureCard = ({ title, feature, value, icon, color, description }: FeatureCardProps) => {
  const styles = colorMap[color];
  
  return (
    <div className={`${styles.bg} rounded-xl shadow-lg p-6 text-white transition-transform hover:scale-[1.02] duration-200`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-white/70">{title}</p>
          <p className="text-lg font-bold mt-1 text-white">{feature}</p>
          <p className="text-3xl font-bold mt-2 text-white">{value}%</p>
        </div>
        <div className={`${styles.iconBg} rounded-full w-12 h-12 flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
      <p className="text-xs text-white/60 mt-3">{description}</p>
    </div>
  );
};
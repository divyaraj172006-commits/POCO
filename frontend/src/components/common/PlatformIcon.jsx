import { FaLinkedinIn, FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";

const platformConfig = {
  linkedin: { icon: FaLinkedinIn, color: "bg-[#0A66C2]", label: "LinkedIn" },
  facebook: { icon: FaFacebookF, color: "bg-[#1877F2]", label: "Facebook" },
  instagram: { icon: FaInstagram, color: "bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]", label: "Instagram" },
  x: { icon: FaXTwitter, color: "bg-[#000000] border border-white/20", label: "X" },
};

export default function PlatformIcon({ platform, size = "md", showLabel = false, className = "" }) {
  const config = platformConfig[platform];
  if (!config) return null;
  const Icon = config.icon;
  const sizes = { sm: "w-7 h-7", md: "w-9 h-9", lg: "w-12 h-12" };
  const iconSizes = { sm: "w-3.5 h-3.5", md: "w-4 h-4", lg: "w-6 h-6" };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizes[size]} ${config.color} rounded-lg flex items-center justify-center`}>
        <Icon className={`${iconSizes[size]} text-white`} />
      </div>
      {showLabel && <span className="text-sm font-medium text-dark-200">{config.label}</span>}
    </div>
  );
}

export { platformConfig };

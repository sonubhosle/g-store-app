import React from 'react';
import { Star } from 'lucide-react';

/**
 * StarRating
 * @param {number}   value       - current rating value (1-5)
 * @param {function} onChange    - called with new value when clicked
 * @param {boolean}  readOnly    - if true, just show stars, no interaction
 * @param {number}   size        - icon size (default 20)
 */
const StarRating = ({ value = 0, onChange, readOnly = false, size = 20 }) => {
    const [hovered, setHovered] = React.useState(0);

    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => {
                const filled = (hovered || value) >= star;
                return (
                    <button
                        key={star}
                        type="button"
                        disabled={readOnly}
                        onClick={() => !readOnly && onChange?.(star)}
                        onMouseEnter={() => !readOnly && setHovered(star)}
                        onMouseLeave={() => !readOnly && setHovered(0)}
                        className={`transition-transform duration-100 ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-125'
                            }`}
                        aria-label={`${star} star${star > 1 ? 's' : ''}`}
                    >
                        <Star
                            size={size}
                            className={`transition-colors ${filled
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-slate-200 fill-slate-200'
                                }`}
                        />
                    </button>
                );
            })}
            {!readOnly && (
                <span className="ml-2 text-sm text-slate-400 font-medium">
                    {hovered || value ? `${hovered || value} star${(hovered || value) > 1 ? 's' : ''}` : 'Select'}
                </span>
            )}
        </div>
    );
};

export default StarRating;

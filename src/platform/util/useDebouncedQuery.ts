import React from "react";

// 自分で定義するのがめんどい人は react-use の useDebounce 使うとよろし
function useDebounce(fn: () => any, ms: number = 0, args: any[] = []) {
    React.useEffect(() => {
        const handle = setTimeout(fn.bind(null, args), ms);

        return () => {
            clearTimeout(handle);
        };
    }, args);
};

export default function useDebouncedQuery(onChange: (query: string) => void) {
    const [searchQuery, setSearchQuery] = React.useState('');

    useDebounce(
        () => {
            onChange(searchQuery);
        },
        400,
        [searchQuery]
    );

    const clearQuery = React.useCallback(() => {
        setSearchQuery('');
    }, []);

    return { searchQuery, setSearchQuery, clearQuery };
}

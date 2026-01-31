import React from 'react';
import { Button, Text } from '@fluentui/react-components';
import { ChevronLeft12Regular, ChevronRight12Regular } from '@fluentui/react-icons';
import { PaginationContainer } from './Categories.styles';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    return (
        <PaginationContainer>
            {totalPages > 0 && <><Button
                icon={<ChevronLeft12Regular />}
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
            />

                <Text>{`Page ${currentPage} of ${totalPages}`}</Text>
                <Button
                    icon={<ChevronRight12Regular />}
                    disabled={currentPage === totalPages}
                    onClick={() => goToPage(currentPage + 1)}
                /> </>}
        </PaginationContainer>
    );
};

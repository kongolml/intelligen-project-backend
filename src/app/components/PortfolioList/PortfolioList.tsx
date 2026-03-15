"use client";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
// import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import Modal from "react-bootstrap/Modal";
import CloseButton from "react-bootstrap/CloseButton";

// GSAP imports
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// types
import { PortfolioCategory, PortfolioCategorySlugs, PortfolioItem } from "@/types/portfolio.types";

import Image from "@/app/components/common/Image";

// styles
import styles from "./PortfolioList.module.scss";
// import PortfolioCategories from "./PortfolioCategories";
import PortfolioCategories from "@/app/components/PortfolioList/PortfolioCategories";
import IconIdentity from "@assets/icon-identity.svg";
import IconWeb from "@assets/icon-web.svg";
import IconPackage from "@assets/icon-package.svg";

interface PortfolioListProps {
	portfolioItems: PortfolioItem[];
	portfolioCategories: PortfolioCategory[];
}

const categoriesIconsMap = {
	[PortfolioCategorySlugs.IDENTITY]: IconIdentity,
	[PortfolioCategorySlugs.PACKAGE]: IconPackage,
	[PortfolioCategorySlugs.WEB]: IconWeb,
} as const;

// Custom Hook to measure an element's width
const useElementWidth = () => {
	const ref = useRef(null);
	const [width, setWidth] = useState(0);

	const updateWidth = useCallback(() => {
		if (ref.current) {
			setWidth(ref.current.offsetWidth);
		}
	}, []);

	useEffect(() => {
		updateWidth(); // Set initial width

		const element = ref.current;
		if (!element) return;

		// Use ResizeObserver to update width when the element resizes
		const observer = new ResizeObserver(() => {
			updateWidth();
		});

		observer.observe(element);

		// Cleanup function to disconnect the observer
		return () => {
			observer.disconnect();
		};
	}, [updateWidth]);

	return { ref, width };
};

export default function PortfolioList({ portfolioItems, portfolioCategories }: PortfolioListProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const { ref: sourceRef, width: sourceWidth } = useElementWidth();

	const initialCategory = searchParams.get("category") || "all";
	const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);

	const allItemsLength = portfolioItems.length;

	const filteredItems = useMemo(() => {
		return selectedCategory === "all"
			? portfolioItems
			: portfolioItems.filter((item) => item.categories.some((category) => category.slug === selectedCategory));
	}, [portfolioItems, selectedCategory]);

	// Create a map of category slug to count
	const categoryCounts = useMemo(() => {
		const counts: Record<string, number> = {};

		portfolioItems.forEach((item) => {
			item.categories.forEach((cat) => {
				counts[cat.slug] = (counts[cat.slug] || 0) + 1;
			});
		});

		return counts;
	}, [portfolioItems]);

	useEffect(() => {
		setSelectedCategory(initialCategory);
	}, [initialCategory]);

	const handleCategoryChange = (category: string) => {
		category === "all" ? router.replace(window.location.pathname, { scroll: false }) : router.replace(`?category=${category}`, { scroll: false });
		setSelectedCategory(category);
	};

	const targetRef = useRef<HTMLDivElement>(null);
	const scrollToCategory = (category: string) => {
		// const categoryElement = document.getElementById(category);
		// if (categoryElement) {
		// 	categoryElement.scrollIntoView({ behavior: "smooth" });
		// }
		handleCategoryChange(category);
		targetRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
	};

	const [show, setShow] = useState(false);
	const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<PortfolioItem | null>(null);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const showPortfolioItem = (item: PortfolioItem) => {
		setSelectedPortfolioItem(item);
		setShow(true);
	};

	const closePortfolioItem = () => {
		setSelectedPortfolioItem(null);
		handleClose();
	};

	// Refs for category sections
	const categorySectionRef = useRef<HTMLDivElement>(null);
	const categoryHeadersRef = useRef<(HTMLHeadingElement | null)[]>([]);
	const categoryIconsRef = useRef<(HTMLDivElement | null)[]>([]);

	// Setup GSAP ScrollTrigger animations
	useEffect(() => {
		// Register ScrollTrigger plugin
		if (typeof window !== "undefined") {
			gsap.registerPlugin(ScrollTrigger);
		}

		if (!categorySectionRef.current || categoryHeadersRef.current.length === 0) return;

		const headers = categoryHeadersRef.current.filter(Boolean);
		const icons = categoryIconsRef.current.filter(Boolean);

		if (headers.length === 0 || icons.length === 0) return;

		// Create sticky container for headers
		const stickyContainer = document.createElement('div');
		stickyContainer.style.cssText = `
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			z-index: 100;
			display: flex;
			align-items: center;
			gap: 2rem;
			padding: 1rem 2rem;
			background-color: transparent;
			pointer-events: none;
		`;
		document.body.appendChild(stickyContainer);

		// Clone headers for sticky version
		const stickyHeaders = headers.map((header, index) => {
			if (!header) return null;
			const clone = header.cloneNode(true) as HTMLElement;
			clone.style.opacity = '0';
			clone.style.pointerEvents = 'none';
			stickyContainer.appendChild(clone);
			return clone;
		});

		// Get the trigger element (the category section)
		const triggerElement = categorySectionRef.current;

		// Create scroll trigger for the category section
		const scrollTrigger = ScrollTrigger.create({
			trigger: triggerElement,
			start: "top top",
			end: "bottom top",
			pin: false,
			onUpdate: (self) => {
				const progress = self.progress;

				// Fade out icons smoothly
				icons.forEach((icon, index) => {
					if (icon) {
						gsap.to(icon, {
							opacity: 1 - progress,
							duration: 0.3,
							ease: "power2.out",
						});
					}
				});

				// Animate headers moving together to the left and becoming sticky
				if (progress > 0.1) {
					// Headers start moving and becoming visible in sticky container
					const headerProgress = Math.min((progress - 0.1) / 0.3, 1); // Accelerate from 0.1 to 0.4 progress

					stickyHeaders.forEach((stickyHeader, index) => {
						if (stickyHeader && headers[index]) {
							const originalHeader = headers[index];
							
							// Fade in sticky header
							gsap.to(stickyHeader, {
								opacity: headerProgress,
								duration: 0.2,
								ease: "power2.out",
							});

							// Calculate position - headers move together to the left
							const targetX = -100 + (index * 200); // Adjust spacing as needed
							gsap.to(stickyHeader, {
								x: targetX * headerProgress,
								duration: 0.2,
								ease: "power2.out",
							});

							// Fade out original header
							gsap.to(originalHeader, {
								opacity: 1 - headerProgress,
								duration: 0.2,
								ease: "power2.out",
							});
						}
					});
				} else {
					// Reset if scrolled back
					stickyHeaders.forEach((stickyHeader) => {
						if (stickyHeader) {
							gsap.to(stickyHeader, {
								opacity: 0,
								x: 0,
								duration: 0.2,
							});
						}
					});
					headers.forEach((header) => {
						if (header) {
							gsap.to(header, {
								opacity: 1,
								duration: 0.2,
							});
						}
					});
				}
			},
		});

		// Cleanup
		return () => {
			scrollTrigger.kill();
			if (document.body.contains(stickyContainer)) {
				document.body.removeChild(stickyContainer);
			}
		};
	}, [portfolioCategories, categoryCounts]);

	return (
		<>
			<div className="container">
				<div className="d-flex justify-content-center flex-column vh-100 ">
					<div className="row">
						<h1>Projects</h1>
					</div>

					<div 
						className="row row-cols-1 row-cols-lg-2 row-cols-xl-3 w-100" 
						ref={categorySectionRef}
					>
						{portfolioCategories.map((category, index) => {
							const CategoryIcon = categoriesIconsMap[category.slug];

							return (
								<div className="col" key={category.slug} onClick={() => scrollToCategory(category.slug)}>
									<h2 
										ref={(el) => {
											categoryHeadersRef.current[index] = el;
										}}
									>
										{category.name} <span className={styles.itemsCount}>{(categoryCounts && categoryCounts[category.slug]) || 0}</span>
									</h2>
									<div 
										className={`${styles.portfolioImageWrp} ${styles[category.slug]} d-flex justify-content-center align-items-center`}
										ref={(el) => {
											categoryIconsRef.current[index] = el;
										}}
									>
										<CategoryIcon className={styles.svgIcon} />
									</div>
								</div>
							);
						})}
					</div>
				</div>

				<Modal show={show} onHide={closePortfolioItem} fullscreen animation={false}>
					<CloseButton onClick={closePortfolioItem} className={styles.closeButton} />
					<Modal.Body className="modal-body d-flex flex-column justify-content-center align-items-center text-center">
						{selectedPortfolioItem && (
							<div>
								<div className={styles.portfolioItemWrp}>
									{/* Fill the 16:9 box. Choose cover (crop) or contain (letterbox). */}
									<Image
										src={selectedPortfolioItem.thumbnail}
										alt={selectedPortfolioItem.title}
										fill
										sizes="90vw"
										style={{ objectFit: "contain" }} /* or "cover" */
									/>
									<p className={styles.portfolioItemDescription}>{selectedPortfolioItem.description}</p>
								</div>
							</div>
						)}
					</Modal.Body>
				</Modal>
			</div>

			<div className="container" ref={targetRef}>
				<div className="row row-cols-1 row-cols-lg-2 row-cols-xl-3">
					{filteredItems.map((item) => (
						<div className="col" key={item.id}>
							{/* <div onClick={() => showPortfolioItem(item)}> */}
							<Link href={`/projects/${item.slug}`}>
								<div className={styles.projectCard}>
									{item.thumbnail && (
										<div className={styles.imageWrap}>
											<Image
												src={item.thumbnail}
												alt={item.title}
												fill
												className={styles.projectImg}
												sizes="(min-width: 1200px) 33vw, (min-width: 768px) 33vw, 100vw"
												draggable={false}
												onContextMenu={(e) => e.preventDefault()}
											/>
										</div>
									)}

									<p>{item.title} {item.mediaFiles.length > 0 ? `files: (${item.mediaFiles.length})` : ""}</p>
								</div>
							</Link>
							{/* </div> */}
						</div>
					))}
				</div>
			</div>
		</>
	);
}

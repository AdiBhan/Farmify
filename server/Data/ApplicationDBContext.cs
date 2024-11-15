using Microsoft.EntityFrameworkCore;
using FarmifyService.models;

namespace FarmifyService.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Buyer> Buyers { get; set; }
        public DbSet<Seller> Sellers { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Bid> Bids { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("User", "public");
                entity.HasKey(e => e.ID);
                
                entity.Property(e => e.ID)
                    .HasColumnType("character");
                
                entity.Property(e => e.Email)
                    .HasColumnType("character varying")
                    .IsRequired();
                
                entity.Property(e => e.Username)
                    .HasColumnType("character varying")
                    .IsRequired();
                
                entity.Property(e => e.Password)
                    .HasColumnType("character varying")
                    .IsRequired();
                
                entity.Property(e => e.sessionID)
                    .HasColumnType("character");
                
                entity.Property(e => e.Credits)
                    .HasColumnType("integer")
                    .IsRequired();
                
                entity.Property(e => e.AccountType)
                    .HasColumnType("text");
                
                entity.Property(e => e.DateCreated)
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP")
                    .IsRequired();

                // Add unique constraint on email
                entity.HasIndex(e => e.Email)
                    .IsUnique();

                // Configure one-to-one relationship with Buyer
                entity.HasOne(u => u.Buyer)
                    .WithOne(b => b.User)
                    .HasForeignKey<Buyer>(b => b.UserID)
                    .OnDelete(DeleteBehavior.Cascade);

                // Configure one-to-one relationship with Seller
                entity.HasOne(u => u.Seller)
                    .WithOne(s => s.User)
                    .HasForeignKey<Seller>(s => s.UserID)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Buyer>(entity =>
            {
                entity.ToTable("Buyer", "public");
                entity.HasKey(e => e.ID);
                entity.Property(e => e.UserID)
                    .HasColumnType("character"); 
            });

            modelBuilder.Entity<Seller>(entity =>
            {
                entity.ToTable("Seller", "public");
                entity.HasKey(e => e.ID);
                entity.Property(e => e.UserID)
                    .HasColumnType("character"); 
            });

            // Configure Product entity
            modelBuilder.Entity<Product>(entity =>
            {
                entity.ToTable("Product", "public");

                entity.HasKey(e => e.ID);

                entity.Property(e => e.ID)
                    .ValueGeneratedOnAdd()
                    .IsRequired();

                entity.Property(e => e.Name)
                    .HasColumnType("character varying(255)")
                    .IsRequired();

                entity.Property(e => e.Description)
                    .HasColumnType("character varying(255)")
                    .IsRequired();

                entity.Property(e => e.Category)
                    .HasColumnType("character varying(255)");

                entity.Property(e => e.SellerID)
                    .HasColumnType("character(36)")
                    .IsRequired();

                entity.Property(e => e.Quantity)
                    .HasColumnType("integer")
                    .IsRequired();

                entity.Property(e => e.StartPrice)
                    .HasColumnType("numeric(8,2)")
                    .IsRequired();

                entity.Property(e => e.EndPrice)
                    .HasColumnType("numeric")
                    .IsRequired();

                entity.Property(e => e.StartTime)
                    .HasColumnType("timestamp without time zone")
                    .IsRequired();

                entity.Property(e => e.EndTime)
                    .HasColumnType("timestamp without time zone")
                    .IsRequired();

                entity.Property(e => e.ImgUrl)
                    .HasColumnType("text");

                entity.HasOne(p => p.Seller)
                    .WithMany()
                    .HasForeignKey(p => p.SellerID)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure Bid entity
            modelBuilder.Entity<Bid>(entity =>
            {
                entity.ToTable("Bid", "public");

                entity.HasKey(e => e.ID);

                entity.Property(e => e.ID)
                    .HasColumnType("character(36)")
                    .IsRequired();

                entity.Property(e => e.BuyerID)
                    .HasColumnType("character(36)")
                    .IsRequired();

                entity.Property(e => e.Amount)
                    .HasColumnType("numeric(8,2)")
                    .IsRequired();

                entity.Property(e => e.TimeStamp)
                    .HasColumnType("timestamp without time zone")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP")
                    .IsRequired();

                entity.Property(e => e.AuctionID)
                    .HasColumnType("bigint")
                    .IsRequired();

                entity.Property(e => e.Price)
                    .HasColumnType("numeric")
                    .IsRequired();

                entity.Property(e => e.DeliveryStatus)
                    .HasColumnType("boolean")
                    .IsRequired();

                entity.Property(e => e.Rating)
                    .HasColumnType("integer");

                entity.HasOne(b => b.Buyer)
                    .WithMany()
                    .HasForeignKey(b => b.BuyerID)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(b => b.Product)
                    .WithMany()
                    .HasForeignKey(b => b.AuctionID)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}